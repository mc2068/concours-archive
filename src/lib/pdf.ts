/**
 * Build the href that opens a paper's PDF at an exercise's start page:
 * `<pdfPath>#page=<pageStart>` (the `#page=` fragment is honoured by the
 * browser's built-in PDF viewer).
 *
 * - Returns `null` when there is no usable path, so the UI can omit the
 *   "Ouvrir" action rather than render a broken link (ADR 0001: link out, no
 *   embedded viewer).
 * - When `pageStart` is not a positive integer, links to the PDF without an
 *   anchor rather than emitting a nonsensical `#page=`.
 */
export function pdfHref(pdfPath: string | undefined | null, pageStart: number): string | null {
  const path = pdfPath?.trim();
  if (!path) return null;
  if (Number.isInteger(pageStart) && pageStart >= 1) return `${path}#page=${pageStart}`;
  return path;
}
