/*
  Derives the web brand assets in `public/` from the full-size source art in
  `design/`.

  The source PNGs are ~800 KB each and painted on an opaque cream ground, which
  is wrong twice over: too heavy for a phone on Tunisian mobile data, and the
  cream square shows as a light block when the mark sits on the charcoal
  masthead. This keys that ground back out to an alpha channel, trims the empty
  margin, and writes small transparent PNGs.

  Run after changing anything in `design/`:  node scripts/build-brand-assets.mjs
*/
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const SRC = new URL('../design/', import.meta.url);
const OUT = new URL('../public/', import.meta.url);

/*
  Coverage below this is the ground's own noise, not art. Held as one constant
  rather than a per-file option: both sources came off the same generator, and a
  knob no caller turns is a knob that rots.
*/
const NOISE_FLOOR = 0.06;

/*
  The art is flat, dark-on-light: every painted pixel is darker than the cream
  ground in all three channels. So a pixel `p` is the ground `bg` composited
  under the art `f` at coverage `a`, and the strongest per-channel darkening
  recovers `a`; dividing it back out recovers `f`. Anti-aliased edges land on a
  partial `a`, which is what keeps the trimmed mark from looking cut out.

  Returns a factory, not a pipeline: a sharp instance cannot be reused once it
  has run, and several outputs share one source.
*/
async function keyOutGround(file) {
  const { data, info } = await sharp(fileURLToPath(new URL(file, SRC)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // The top-left pixel is always ground: the art is centred with a wide margin.
  const bg = [data[0], data[1], data[2]];

  let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
  for (let i = 0; i < data.length; i += 4) {
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (bg[c] - data[i + c]) / bg[c]);
    a = a < NOISE_FLOOR ? 0 : Math.min(1, a);

    if (a === 0) {
      data[i + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - (1 - a) * bg[c]) / a)));
    }
    data[i + 3] = Math.round(a * 255);

    const px = (i / 4) % info.width;
    const py = Math.floor(i / 4 / info.width);
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }

  if (maxX < 0) {
    throw new Error(
      `${file}: every pixel sits within ${NOISE_FLOOR} of the top-left colour, so there is ` +
        `no art to key out. Either the source is not dark art on a flat light ground, or it ` +
        `no longer starts on a margin.`,
    );
  }

  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  return () =>
    sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).extract(box);
}

const encode = (pipeline) => pipeline.png({ compressionLevel: 9, palette: true });

await mkdir(fileURLToPath(OUT), { recursive: true });
const out = (name) => fileURLToPath(new URL(name, OUT));

/*
  Widths are the CSS box times ~3, so the art stays sharp on a phone. Nothing is
  forced to a square: the marks are not square, and the pages size them by width
  with `height: auto`. The favicon is the exception — browsers expect a square
  icon — so that one is padded, never stretched.
*/
const mark = await keyOutGround('logo.png');
await encode(mark().resize({ width: 128 })).toFile(out('logo.png'));
await encode(
  mark().resize({
    width: 64,
    height: 64,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  }),
).toFile(out('favicon.png'));

const emptyState = await keyOutGround('empty-state.png');
await encode(emptyState().resize({ width: 192 })).toFile(out('empty-state.png'));

console.log('brand assets written to public/');
