/**
 * Guide themes (WO-37): the look of a build's page below the site header. Each theme is a set of
 * CSS custom properties that override the site's tokens (globals.css) on the build page's root, so
 * components need no theme logic. Ember is the site's own look and the default. Layout never changes,
 * nor do fonts, except Aurora's: it sets the build's title in the pixel face (WO-89). Colours for the
 * first five come from the canvas artboard "DetailsThemes", Aurora's from the coming soon page; the
 * shades between them are picked to keep every text pair at WCAG AA (themes.test.ts checks).
 */
import type { CSSProperties } from "react";

export type ThemeId = "ember" | "parchment" | "frost" | "daedric" | "dwemer" | "aurora";

/** The tokens a theme sets. Names match globals.css without the leading "--". */
export interface ThemeVars {
  ground: string;
  panel: string;
  "panel-raised": string;
  "panel-high": string;
  sunk: string;
  "sunk-deep": string;
  rule: string;
  "rule-soft": string;
  "rule-strong": string;
  "line-bright": string;
  text: string;
  soft: string;
  muted: string;
  faint: string;
  dim: string;
  bright: string;
  ember: string;
  "ember-text": string;
  "ember-hover": string;
  "ember-press": string;
  "on-ember": string;
  brass: string;
  destiny: string;
  "destiny-text": string;
  "destiny-line": string;
  "destiny-ground": string;
  health: string;
  magicka: string;
  stamina: string;
  stripe: string;
  /** Laid over the cover image to tint it; "transparent" for none. */
  "hero-tint": string;
  /** How much of the ground lies over the whole cover image (a light theme's dark text needs it). */
  "hero-veil": string;
  /** The hero with no cover image. */
  "hero-plain": string;
  /** Pixel art for the hero with no cover image, layered front to back (WO-89); "none" for none. */
  "hero-art": string;
  /** The face of the build's title in the hero (WO-89): the site's title face, but Aurora's pixel one. */
  "hero-title-font": string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  line: string;
  /** A light theme: the perk trees keep the night sky of Ember inside it. */
  light?: boolean;
  vars: ThemeVars;
}

const EMBER: ThemeVars = {
  ground: "#0e1319",
  panel: "#141b23",
  "panel-raised": "#1a2230",
  "panel-high": "#222b38",
  sunk: "#10161e",
  "sunk-deep": "#0b1016",
  rule: "#2a3442",
  "rule-soft": "#1c2430",
  "rule-strong": "#3a4658",
  "line-bright": "#4a5668",
  text: "#e4ebf0",
  soft: "#c3cdd6",
  muted: "#8e9bab",
  faint: "#7d8a9a",
  dim: "#6f7c8c",
  bright: "#ffffff",
  ember: "#f0913f",
  "ember-text": "#f6c08f",
  "ember-hover": "#f5a55a",
  "ember-press": "#d97f33",
  "on-ember": "#0e1319",
  brass: "#b9a173",
  destiny: "#b9a173",
  "destiny-text": "#d9c491",
  "destiny-line": "#5a4b2c",
  "destiny-ground": "#15140f",
  health: "#d07a6a",
  magicka: "#7d9fd6",
  stamina: "#86b47f",
  stripe: "rgba(255, 255, 255, 0.035)",
  "hero-tint": "transparent",
  "hero-veil": "0%",
  "hero-plain": "none",
  "hero-art": "none",
  "hero-title-font": "var(--font-title)",
};

export const THEMES: Theme[] = [
  { id: "ember", name: "Ember", line: "Night and forge-light. The default.", vars: EMBER },
  {
    id: "parchment",
    name: "Parchment",
    line: "A note left on a table.",
    light: true,
    vars: {
      ground: "#ebe1c8",
      panel: "#f4edda",
      "panel-raised": "#e4d8b9",
      "panel-high": "#dccfac",
      sunk: "#e6dbbf",
      "sunk-deep": "#ded2b3",
      rule: "#c9b893",
      "rule-soft": "#d9cba7",
      "rule-strong": "#b19e75",
      "line-bright": "#9c8862",
      text: "#2b2116",
      soft: "#45372a",
      muted: "#6e5d45",
      faint: "#6b5a42",
      dim: "#76654c",
      bright: "#1a120a",
      ember: "#8c2f1c",
      "ember-text": "#7a2816",
      "ember-hover": "#a33a24",
      "ember-press": "#74261a",
      "on-ember": "#f4edda",
      brass: "#8a6d3b",
      destiny: "#8a6d3b",
      "destiny-text": "#664d22",
      "destiny-line": "#b59a66",
      "destiny-ground": "#e5d8b4",
      health: "#9a3a2a",
      magicka: "#2f5694",
      stamina: "#3c6634",
      stripe: "rgba(60, 40, 20, 0.05)",
      "hero-tint": "#b9a77f",
      "hero-veil": "62%",
      "hero-plain": "linear-gradient(180deg, #b9a77f 0%, #ebe1c8 100%)",
      "hero-art": "none",
      "hero-title-font": "var(--font-title)",
    },
  },
  {
    id: "frost",
    name: "Frost",
    line: "Snow light over the Throat.",
    vars: {
      ground: "#0f1a24",
      panel: "#142330",
      "panel-raised": "#1a2c3c",
      "panel-high": "#213547",
      sunk: "#0d1720",
      "sunk-deep": "#0a131b",
      rule: "#27394a",
      "rule-soft": "#1b2a38",
      "rule-strong": "#364c60",
      "line-bright": "#4a6378",
      text: "#eaf2f8",
      soft: "#c6d6e2",
      muted: "#8fa6b8",
      faint: "#829aad",
      dim: "#738b9f",
      bright: "#ffffff",
      ember: "#8ecae6",
      "ember-text": "#c4e4f3",
      "ember-hover": "#a9d8ee",
      "ember-press": "#74b6d6",
      "on-ember": "#0f1a24",
      brass: "#c9d6df",
      destiny: "#c9d6df",
      "destiny-text": "#dbe6ee",
      "destiny-line": "#4d6070",
      "destiny-ground": "#122030",
      health: "#d9877a",
      magicka: "#8aaee6",
      stamina: "#93c28c",
      stripe: "rgba(255, 255, 255, 0.035)",
      "hero-tint": "#34506a",
      "hero-veil": "0%",
      "hero-plain": "linear-gradient(180deg, #34506a 0%, #0f1a24 100%)",
      "hero-art": "none",
      "hero-title-font": "var(--font-title)",
    },
  },
  {
    id: "daedric",
    name: "Daedric",
    line: "Black iron and old blood.",
    vars: {
      ground: "#120a0b",
      panel: "#1b0f10",
      "panel-raised": "#241415",
      "panel-high": "#2c1a1b",
      sunk: "#0f0809",
      "sunk-deep": "#0b0606",
      rule: "#3a2022",
      "rule-soft": "#2a1718",
      "rule-strong": "#4d2b2d",
      "line-bright": "#63393a",
      text: "#f0e4e2",
      soft: "#d5c3c0",
      muted: "#a68c88",
      faint: "#9a807c",
      dim: "#8c7470",
      bright: "#ffffff",
      ember: "#e2513c",
      "ember-text": "#f3a093",
      "ember-hover": "#ea6a56",
      "ember-press": "#c03b28",
      "on-ember": "#120a0b",
      brass: "#b8862f",
      destiny: "#b8862f",
      "destiny-text": "#d9a957",
      "destiny-line": "#5a4220",
      "destiny-ground": "#1a1209",
      health: "#db8676",
      magicka: "#8aa6d9",
      stamina: "#93ba8b",
      stripe: "rgba(255, 255, 255, 0.03)",
      "hero-tint": "#4a1a18",
      "hero-veil": "0%",
      "hero-plain": "linear-gradient(180deg, #4a1a18 0%, #120a0b 100%)",
      "hero-art": "none",
      "hero-title-font": "var(--font-title)",
    },
  },
  {
    id: "dwemer",
    name: "Dwemer",
    line: "Bronze, steam and verdigris.",
    vars: {
      ground: "#10181a",
      panel: "#162224",
      "panel-raised": "#1c2b2d",
      "panel-high": "#233436",
      sunk: "#0d1415",
      "sunk-deep": "#0a1011",
      rule: "#2c3b3c",
      "rule-soft": "#1f2b2c",
      "rule-strong": "#3b4d4e",
      "line-bright": "#4f6566",
      text: "#e8e2d4",
      soft: "#cdc6b6",
      muted: "#93a39f",
      faint: "#86968f",
      dim: "#77877f",
      bright: "#fff8e8",
      ember: "#d39b4a",
      "ember-text": "#ecc78f",
      "ember-hover": "#dfae66",
      "ember-press": "#b8833a",
      "on-ember": "#10181a",
      brass: "#6fae9c",
      destiny: "#6fae9c",
      "destiny-text": "#95cbbb",
      "destiny-line": "#2f5249",
      "destiny-ground": "#0f1d1b",
      health: "#d68a79",
      magicka: "#86a8dc",
      stamina: "#8fbf88",
      stripe: "rgba(255, 255, 255, 0.03)",
      "hero-tint": "#3a3524",
      "hero-veil": "0%",
      "hero-plain": "linear-gradient(180deg, #3a3524 0%, #10181a 100%)",
      "hero-art": "none",
      "hero-title-font": "var(--font-title)",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    line: "Stars, snow and a campfire.",
    vars: {
      ground: "#0c1222",
      panel: "#111a2e",
      "panel-raised": "#17213a",
      "panel-high": "#1e2a46",
      sunk: "#0e1528",
      "sunk-deep": "#090e1b",
      rule: "#25304d",
      "rule-soft": "#19223a",
      "rule-strong": "#34416a",
      "line-bright": "#4a588a",
      text: "#f3ead8",
      soft: "#ddd5c6",
      muted: "#a7a08f",
      faint: "#9a9384",
      dim: "#857e70",
      bright: "#fffaf0",
      ember: "#f0913f",
      "ember-text": "#f6c08f",
      "ember-hover": "#f5a55a",
      "ember-press": "#d97f33",
      "on-ember": "#0c1222",
      // The cream of the coming soon page's dialogue box.
      brass: "#e8d3a4",
      // Destiny in aurora green.
      destiny: "#7cc9a2",
      "destiny-text": "#a8e0c2",
      "destiny-line": "#2c5a48",
      "destiny-ground": "#0d1c1f",
      health: "#d9877a",
      magicka: "#8aaee6",
      stamina: "#93c28c",
      stripe: "transparent",
      "hero-tint": "#0e1a36",
      "hero-veil": "0%",
      "hero-plain": "linear-gradient(180deg, #0e1a36 0%, #0c1222 100%)",
      // The coming soon scene, front to back: the land, stars A and aurora A over the sky.
      "hero-art": "url(/coming-soon/px/hero-land.png), url(/coming-soon/px/hero-stars-a.png), url(/coming-soon/px/hero-aurora-a.png), url(/coming-soon/px/hero-sky.png)",
      "hero-title-font": "var(--font-pixel), var(--font-title)",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "ember";
export const THEME_IDS = THEMES.map((t) => t.id) as [ThemeId, ...ThemeId[]];

/**
 * Themes are off for now (WO-118): every page draws in Ember, whatever theme a build has stored. The
 * stored value stays, so a theme can come back once the reader, Play, the edit pages and the cards all
 * follow it (the backlog's "Themes across every page").
 */
export const THEMES_ON = false;

/** The theme a page draws in: the stored one while themes are on, else Ember. */
export const drawnTheme = (id: string | undefined): ThemeId => (THEMES_ON ? themeOf(id).id : DEFAULT_THEME);

export function themeOf(id: string | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** The theme as inline custom properties, for the build page's root (and the Set up preview). */
export function themeStyle(id: string | undefined): CSSProperties {
  const t = themeOf(id);
  return Object.fromEntries(Object.entries(t.vars).map(([k, v]) => [`--${k}`, v])) as CSSProperties;
}
