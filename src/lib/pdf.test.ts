import { describe, expect, it } from 'vitest';
import { pdfHref } from './pdf';

describe('pdfHref', () => {
  it('anchors a valid path to the start page', () => {
    expect(pdfHref('/papers/centrale-2022.pdf', 6)).toBe('/papers/centrale-2022.pdf#page=6');
  });

  it('returns null when there is no usable path (graceful degradation)', () => {
    expect(pdfHref(undefined, 1)).toBeNull();
    expect(pdfHref(null, 1)).toBeNull();
    expect(pdfHref('', 1)).toBeNull();
    expect(pdfHref('   ', 1)).toBeNull();
  });

  it('links to the PDF without an anchor when the page is not a positive integer', () => {
    expect(pdfHref('/a.pdf', 0)).toBe('/a.pdf');
    expect(pdfHref('/a.pdf', -3)).toBe('/a.pdf');
    expect(pdfHref('/a.pdf', 1.5)).toBe('/a.pdf');
    expect(pdfHref('/a.pdf', Number.NaN)).toBe('/a.pdf');
  });

  it('trims surrounding whitespace from the path', () => {
    expect(pdfHref('  /a.pdf  ', 2)).toBe('/a.pdf#page=2');
  });
});
