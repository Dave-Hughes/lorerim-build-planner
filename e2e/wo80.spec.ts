/**
 * WO-80: the sample build offered on a first visit, and the reader's tour in page order, with Next
 * scrolling to each stop, Back, the count, and stops a build doesn't have skipped.
 */
import { expect, test, type Page } from "@playwright/test";
import { FOUR_BUILD_ID, IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 }, storageState: { cookies: [], origins: [] } });

const ORDER = ["Levels", "The pinned bar", "The level card", "Attributes and skills", "Perk trees", "Gear", "Spells", "Guide"];
const TARGET: Record<string, string> = {
  Levels: "level-row",
  "The pinned bar": "pinned-bar",
  "The level card": "level-card",
  "Attributes and skills": "attributes-skills",
  "Perk trees": "perks",
  Gear: "gear",
  Spells: "spells",
  Guide: "build-tabs",
};

/** The stop on screen: its title, "k of n", and whether its part of the page is in view. */
async function stopNow(page: Page) {
  const card = page.getByRole("dialog");
  await expect(card).toContainText(/\d+ of \d+/);
  const title = (await card.getByRole("heading").textContent())!;
  const [k, n] = (await card.textContent())!.match(/(\d+) of (\d+)/)!.slice(1).map(Number);
  return { title, k, n };
}

test("point 2: a first visit to the home page offers the sample build; Show me opens it with the tour at stop 1", async ({ page }) => {
  await page.goto("/");
  const offer = page.getByRole("dialog", { name: "New here?" });
  await expect(offer).toContainText("Walk through a sample build.");
  await offer.getByRole("button", { name: "Show me" }).click();
  await page.waitForURL(new RegExp(`/b/${IRIEL_BUILD_ID}\\?level=1&tour=1`));
  const card = page.getByRole("dialog", { name: "Levels" });
  await expect(card).toContainText(/^.*1 of \d+/);
  await expect(page.getByRole("dialog", { name: "Tapps here" })).toHaveCount(0);
});

test("point 2: No thanks closes it, and the tour starts on the next build opened; neither shows again once done", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("dialog", { name: "New here?" }).getByRole("button", { name: "No thanks" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "LoreRim Planner" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "New here?" })).toHaveCount(0);
  await page.goto(`/b/${FOUR_BUILD_ID}`);
  await expect(page.getByRole("dialog", { name: "Levels" })).toContainText("1 of");
  await page.keyboard.press("Escape");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "LoreRim Planner" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("points 3 and 4: Next scrolls to each stop in page order and lights it; Back returns; the count matches", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}?level=10&tour=1`);
  const seen: string[] = [];
  for (;;) {
    const s = await stopNow(page);
    expect(s.k).toBe(seen.length + 1);
    seen.push(s.title);
    // Its part of the page is on screen, under the light.
    await expect(page.locator(`[data-tour="${TARGET[s.title]}"]`).first()).toBeInViewport({ ratio: 0.1 });
    if (s.title === "The pinned bar") await expect(page.getByRole("region", { name: "Pinned bar" })).toBeVisible();
    if (s.k === 3) {
      await page.getByRole("dialog").getByRole("button", { name: "Back" }).click();
      await expect(page.getByRole("dialog", { name: seen[1] })).toContainText(`2 of ${s.n}`);
      await page.getByRole("dialog").getByRole("button", { name: "Next", exact: true }).click();
      await expect(page.getByRole("dialog", { name: seen[2] })).toContainText(`3 of ${s.n}`);
    }
    if (s.k === s.n) break;
    await page.getByRole("dialog").getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText(`${s.k + 1} of ${s.n}`);
  }
  // In page order: the order's list, less any stop this build doesn't have.
  expect(seen).toEqual(ORDER.filter((t) => seen.includes(t)));
  expect(seen.length).toBe(await page.getByRole("dialog").textContent().then((t) => Number(t!.match(/of (\d+)/)![1])));
  expect(seen).toEqual(expect.arrayContaining(["Levels", "The pinned bar", "The level card", "Attributes and skills", "Perk trees", "Gear", "Guide"]));
  await page.getByRole("dialog").getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("point 3: a stop the build doesn't have is skipped, and the count follows", async ({ page }) => {
  // Four Levels: gear, but no spells and no guide.
  await page.goto(`/b/${FOUR_BUILD_ID}?tour=1`);
  const seen: string[] = [];
  for (;;) {
    const s = await stopNow(page);
    seen.push(s.title);
    if (s.k === s.n) break;
    await page.getByRole("dialog").getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText(`${s.k + 1} of ${s.n}`);
  }
  expect(seen).toContain("Gear");
  expect(seen).not.toContain("Spells");
  expect(seen).not.toContain("Guide");
  expect(seen).toHaveLength(6);
  expect(seen).toEqual(ORDER.filter((t) => seen.includes(t)));
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("point 4: the card sits at the bottom, clear of what it points at", async ({ page }) => {
    await page.goto(`/b/${IRIEL_BUILD_ID}?level=10&tour=1`);
    for (let i = 0; i < 3; i++) {
      const card = page.getByRole("dialog");
      await expect(card).toContainText(`${i + 1} of`);
      const box = (await card.boundingBox())!;
      expect(box.y + box.height).toBeGreaterThan(844 - 40);
      await card.getByRole("button", { name: "Next", exact: true }).click();
    }
  });
});
