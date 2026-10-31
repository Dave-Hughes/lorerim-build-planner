/**
 * How far one wheel event zooms a map (WO-185 Part 2). Dave: one notch or a small trackpad pinch jumped too far, because every event zoomed by a fixed 1.2 and a trackpad sends
 * dozens. Now the factor follows the size of the event: a mouse notch (about 100 pixels, or 3 lines) is a step of about 1.2, a trackpad pinch (Ctrl and small deltas) is
 * in proportion to the gesture, and no single event goes further than one step and a bit.
 */
export const NOTCH = 1.2;
/** What one `+` or `−` press does: one level. */
export const BUTTON_STEP = 1.5;

const PER_PIXEL = Math.log(NOTCH) / 100;
const PINCH_PER_PIXEL = 0.01;
const MOST = 1.25;

/** The multiplier for the map's scale: above 1 zooms in (a wheel turned away, a pinch opening). */
export function wheelFactor(e: { deltaY: number; deltaMode?: number; ctrlKey?: boolean }): number {
  // Lines and pages become pixels: a notch of three lines is the same as a hundred pixels.
  const px = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1);
  const per = e.ctrlKey && Math.abs(px) < 50 ? PINCH_PER_PIXEL : PER_PIXEL;
  return Math.min(MOST, Math.max(1 / MOST, Math.exp(-px * per)));
}
