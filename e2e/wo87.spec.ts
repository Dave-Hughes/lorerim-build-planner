/**
 * WO-87: the coming soon page, fourth pass: the pixel hero, How this started, What it is and Coming
 * later. Playwright's clock moves the page's timers.
 */
import { expect, test } from "@playwright/test";
import { DISCORD } from "../src/lib/links";

test.use({ viewport: { width: 1440, height: 900 } });

const hero = (page: import("@playwright/test").Page) =>
  page.locator("section").first();
const fg = (page: import("@playwright/test").Page) =>
  hero(page).locator("img[data-fg]");

test("the hero: no button, the Modding Bungalo link under Opening soon, crisp pixels, and the fire moves", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/coming-soon");
  await expect(hero(page).locator("a.btn, a[class*='button']")).toHaveCount(0);
  await expect(
    hero(page).getByText("Opening soon", { exact: true }),
  ).toBeVisible();
  await expect(
    hero(page).getByText(/Will be shared in the\s+Modding Bungalo\s+Discord\./),
  ).toBeVisible();
  await expect(
    hero(page).getByRole("link", { name: "Modding Bungalo" }),
  ).toHaveAttribute("href", DISCORD);
  // The title is the pixel wordmark, named for screen readers.
  await expect(
    hero(page).getByRole("heading", {
      level: 1,
      name: "LoreRim Build Planner",
    }),
  ).toBeVisible();
  // Every layer drawn pixel for pixel; only the land has alt text.
  const layers = hero(page).locator('img[src^="/coming-soon/px/hero-"]');
  // Sky, two star layers, two aurora layers, the land in six layers (for the parallax), the fire.
  await expect(layers).toHaveCount(12);
  expect(
    await layers.evaluateAll((els) =>
      els.every((e) => getComputedStyle(e).imageRendering === "pixelated"),
    ),
  ).toBe(true);
  expect(
    await layers.evaluateAll(
      (els) => els.filter((e) => e.getAttribute("alt")).length,
    ),
  ).toBe(1);
  // Two reads 600 ms apart: the fire has stepped.
  const a = await fg(page).getAttribute("src");
  await page.clock.runFor(600);
  expect(await fg(page).getAttribute("src")).not.toBe(a);
});

test("with reduced motion the hero holds its first frame, stars A and aurora A, and the panels hold frame 0", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/coming-soon");
  const a = await fg(page).getAttribute("src");
  expect(a).toContain("hero-fg-0");
  await page.clock.runFor(600);
  expect(await fg(page).getAttribute("src")).toBe(a);
  await expect(hero(page).locator('img[src$="hero-stars-a.png"]')).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(hero(page).locator('img[src$="hero-aurora-a.png"]')).toHaveCSS(
    "opacity",
    "1",
  );
  // The cutscene holds its first scene, its line already written out.
  await expect(page.locator('img[src$="/p1-0.png"]')).toBeVisible();
  await expect(page.getByTestId("story-line")).toHaveText(
    "I loved LoreRim from the start.",
  );
});

test("How this started has its four panels; What it is comes before Plan a character; Coming later has both cards", async ({
  page,
}) => {
  await page.goto("/coming-soon");
  const story = page.getByRole("region", { name: "How this started" });
  const lines = [
    ["Level 1", "I loved LoreRim from the start."],
    ["Level 3", "But it's tough as hell."],
    ["Level 10", "So I read guides from other players."],
    [
      "Level 50",
      "Then I built a place where we can make more complete guides, and share them with each other.",
    ],
  ];
  // The whole story is in the page for screen readers, one item a scene.
  for (const [label, text] of lines)
    await expect(story.locator(".sr-only")).toContainText(`${label}: ${text}`);
  // A marker for each scene; picking one shows its scene and types its line out.
  await expect(story.getByRole("button")).toHaveCount(4);
  await story.getByRole("button", { name: "Level 10" }).click();
  await expect(story.getByRole("button", { name: "Level 10" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(story.locator('img[src*="/p3-"]')).toBeVisible();
  await expect(story.getByTestId("story-line")).toHaveText(
    "So I read guides from other players.",
    { timeout: 5000 },
  );

  const what = page.getByRole("region", { name: "What it is" });
  await expect(what).toContainText("A character planner for LoreRim.");
  await expect(what).toContainText(
    "It starts with LoreRim 5.0.4.8. Later versions will be supported as they come out.",
  );
  await expect(what.getByRole("listitem")).toHaveCount(4);
  const whatY = (await what.boundingBox())!.y;
  const planY = (await page
    .getByRole("region", { name: "Plan a character", exact: true })
    .boundingBox())!.y;
  expect(whatY).toBeLessThan(planY);
  // The old Why I made this is gone.
  await expect(
    page.getByRole("heading", { name: "Why I made this" }),
  ).toHaveCount(0);

  const later = page.getByRole("region", { name: "Coming later" });
  await expect(later).toContainText("Story and roleplay");
  await expect(later).toContainText("LoreRim survival guide");
  await expect(later).toContainText(
    "Add story and roleplay ideas for your character, for those of us who really enjoy that kind of thing.",
  );
  await expect(later).toContainText(
    "A simple survival guide covering the basics of playing in LoreRim.",
  );
  await expect(later.locator('img[src="/icons/tab-story.svg"]')).toBeVisible();
  await expect(
    later.locator('img[src="/icons/chapter-staying-alive.svg"]'),
  ).toBeVisible();
  // The icon wall sits behind it, and a last word about opening closes it.
  const wall = await later.evaluate(
    (el) =>
      getComputedStyle(el.querySelector('[aria-hidden="true"]')!)
        .backgroundImage,
  );
  expect(wall).toContain("/coming-soon/px/icon-wall.png");
  await expect(later).toContainText(
    "The planner is nearly ready. It will be shared in the Modding Bungalo Discord when it opens.",
  );
  await expect(
    later.getByRole("link", { name: "Modding Bungalo" }),
  ).toHaveAttribute("href", /discord/);
  expect(
    (await page.request.get("/coming-soon/px/icon-wall.png")).status(),
  ).toBe(200);
});

test("the hero's layers lag behind as the page scrolls, in whole art pixels; with reduced motion they don't", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/coming-soon");
  const y = (name: string) =>
    hero(page)
      .locator(`img[src="/coming-soon/px/hero-land-${name}.png"]`)
      .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => y("moon")).toBeGreaterThan(0);
  expect(await y("ground")).toBe(0);
  // At 1440 wide one art pixel is 5 screen pixels.
  expect((await y("far")) % 5).toBe(0);
  expect(await y("moon")).toBeGreaterThan(await y("forest-near"));

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/coming-soon");
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
  expect(await y("moon")).toBe(0);
});
