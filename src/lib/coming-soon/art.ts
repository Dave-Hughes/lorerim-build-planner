/**
 * The coming soon page's pixel art (WO-87), drawn by scripts/coming-soon/build.py into
 * public/coming-soon/px/. Edit the scripts and run them again; never the PNGs.
 */
const px = (name: string) => `/coming-soon/px/${name}.png`;

/** The hero's layers, back to front, at 288 by 150. The foreground (the campfire, Tapps writing) has six frames. */
export const HERO = {
  sky: px("hero-sky"),
  stars: [px("hero-stars-a"), px("hero-stars-b")],
  aurora: [px("hero-aurora-a"), px("hero-aurora-b")],
  land: px("hero-land"),
  /** The title, a pixel wordmark at 113 by 38 art pixels. */
  wordmark: px("wordmark"),
  /** The land as six layers, back to front, for the parallax: how far each lags as the page scrolls (0 moves with it). */
  landLayers: (
    [
      ["moon", 0.5],
      ["far", 0.38],
      ["near", 0.26],
      ["forest-far", 0.15],
      ["forest-near", 0.07],
      ["ground", 0],
    ] as const
  ).map(([name, depth]) => ({ src: px(`hero-land-${name}`), depth })),
  fg: [0, 1, 2, 3, 4, 5].map((i) => px(`hero-fg-${i}`)),
};

/** "How this started": four scenes at 160 by 100, each a run of frames, and Tapps's line for each (Dave, 15 Oct). */
export const STORY = [
  {
    label: "Level 1",
    text: "I loved LoreRim from the start.",
    alt: "Tapps on a road at dawn, pointing past a signpost",
    frames: [0, 1].map((i) => px(`p1-${i}`)),
  },
  {
    label: "Level 3",
    text: "But it's tough as hell.",
    alt: "Tapps in a dark forest at night, a sabre cat with glowing eyes behind him",
    frames: [0, 1, 0, 2].map((i) => px(`p2-${i}`)),
  },
  {
    label: "Level 10",
    text: "So I read guides from other players.",
    alt: "Tapps at a desk by candlelight, reading other players' guides",
    frames: [0, 1, 2, 3].map((i) => px(`p3-${i}`)),
  },
  {
    label: "Level 50",
    text: "Then I built a place where we can make more complete guides, and share them with each other.",
    alt: "Tapps cheering beside a notice board covered in pinned guides",
    frames: [0, 1, 2, 3].map((i) => px(`p4-${i}`)),
  },
];

/** Every pixel image the page uses. */
export const ART_FILES = [HERO.wordmark, HERO.sky, ...HERO.stars, ...HERO.aurora, HERO.land, ...HERO.landLayers.map((l) => l.src), ...HERO.fg, ...STORY.flatMap((s) => s.frames)];
