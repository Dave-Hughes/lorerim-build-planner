import { describe, expect, it } from "vitest";
import { THEMES, themeOf, themeStyle, type ThemeVars } from "./themes";

function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

type Key = keyof ThemeVars;
/** Body text: 4.5:1. */
const TEXT: [Key, Key][] = [
  ["text", "ground"],
  ["text", "panel"],
  ["text", "panel-raised"],
  ["soft", "ground"],
  ["soft", "panel"],
  ["muted", "ground"],
  ["muted", "panel"],
  ["faint", "ground"],
  ["faint", "panel"],
  ["bright", "ground"],
  ["ember", "ground"],
  ["ember", "panel"],
  ["ember-text", "ground"],
  ["on-ember", "ember"],
  ["destiny-text", "ground"],
  ["destiny-text", "destiny-ground"],
  ["health", "ground"],
  ["magicka", "ground"],
  ["stamina", "ground"],
];
/** Large text, icons and ornaments: 3:1. (line-bright only draws decorative lines: not checked.) */
const LARGE: [Key, Key][] = [
  ["dim", "ground"],
  ["brass", "ground"],
  ["destiny", "ground"],
  ["on-ember", "ember-hover"],
];

describe("guide themes", () => {
  it("Ember is the default, for a missing or unknown theme", () => {
    expect(themeOf(undefined).id).toBe("ember");
    expect(themeOf("nope").id).toBe("ember");
    expect((themeStyle("frost") as Record<string, string>)["--ground"]).toBe("#0f1a24");
  });

  it("every theme sets every token", () => {
    const keys = Object.keys(THEMES[0].vars).sort();
    for (const t of THEMES) expect(Object.keys(t.vars).sort()).toEqual(keys);
  });

  for (const t of THEMES)
    it(`${t.name} meets WCAG AA`, () => {
      const fails: string[] = [];
      for (const [min, pairs] of [[4.5, TEXT], [3, LARGE]] as const)
        for (const [f, b] of pairs) {
          const r = contrast(t.vars[f], t.vars[b]);
          if (r < min) fails.push(`${f} on ${b}: ${r.toFixed(2)}`);
        }
      expect(fails).toEqual([]);
    });
});
