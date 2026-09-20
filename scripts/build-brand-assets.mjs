/*
  Derives the web brand assets in `public/` from the full-size source art in
  `design/`.

  The source PNGs are ~800 KB each and painted on an opaque cream ground, which
  is wrong twice over: too heavy for a phone on Tunisian mobile data, and the
  cream square shows as a light block when the mark sits on the charcoal
  masthead. This unmixes the known flat background back out to an alpha channel,
  trims the empty margin, and writes small transparent PNGs.

  Run after changing anything in `design/`:  node scripts/build-brand-assets.mjs
*/
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const SRC = new URL('../design/', import.meta.url);
const OUT = new URL('../public/', import.meta.url);

/*
  The art is flat, dark-on-light: every painted pixel is darker than the cream
  ground in all three channels. So a pixel `p` is the ground `bg` composited
  under the art `f` at coverage `a`, and the strongest per-channel darkening
  recovers `a`; dividing it back out recovers `f`. Anti-aliased edges land on a
  partial `a`, which is what keeps the trimmed mark from looking cut out.
*/
async function unmix(file, { width, floor = 0.06 }) {
  const src = sharp(fileURLToPath(new URL(file, SRC)));
  const { data, info } = await src
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // The top-left pixel is always ground: the art is centred with a wide margin.
  const bg = [data[0], data[1], data[2]];

  let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
  for (let i = 0; i < data.length; i += 4) {
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (bg[c] - data[i + c]) / bg[c]);
    // Below the floor it is sensor-ish noise in the ground, not art.
    a = a < floor ? 0 : Math.min(1, a);

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

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize({ width, fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true });
}

await mkdir(fileURLToPath(OUT), { recursive: true });
const out = (name) => fileURLToPath(new URL(name, OUT));

// Masthead mark: rendered at 32-40px, so 128 covers 3x displays.
await (await unmix('logo.png', { width: 128 })).toFile(out('logo.png'));
// Favicon: one 64px PNG; every target browser has taken PNG icons for a decade.
await (await unmix('logo.png', { width: 64 })).toFile(out('favicon.png'));
// Empty state: capped at 96px so it reads as a quiet marker, not a poster.
await (await unmix('empty-state.png', { width: 96 })).toFile(out('empty-state.png'));

console.log('brand assets written to public/');
