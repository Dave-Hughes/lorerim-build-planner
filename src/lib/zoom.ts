/**
 * The page's scale on big monitors (WO-35: CSS zoom on the root, from --page-zoom). The pointer and
 * getBoundingClientRect are in screen pixels; positions set in CSS are in the page's own, so code
 * that turns one into the other divides by this.
 */
export function pageZoom(): number {
  if (typeof document === "undefined") return 1;
  const z = parseFloat(getComputedStyle(document.documentElement).zoom);
  return Number.isFinite(z) && z > 0 ? z : 1;
}
