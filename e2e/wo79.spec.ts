/**
 * WO-79: the Story. One author writes it (title, opening line, three paragraphs, a quote, five
 * captioned images, a sixth refused); then a reader opens it in the reader (WO-116).
 */
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { signIn, editTab } from "./helpers";
import { SEVARI_BUILD_ID, STORY_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });
test.describe.configure({ mode: "serial" });

const ART = ["swimmer", "marathon-runner", "old-fashioned", "fencer", "monk", "hoarder"].map((name) => ({
  name: `${name}.webp`,
  mimeType: "image/webp",
  buffer: readFileSync(`public/traits/${name}.webp`),
}));
const P1 = "The ship from Ebonheart put in at Windhelm three hours after dark.";
const CAPTIONS = ["Windhelm, the night the ship came in.", "The road south, the first week.", "Riften, by the canal.", "The house by the canal.", "The Bee and Barb, after."];

test("point 2: an author writes a Story with a title, three paragraphs, a quote and 5 captioned images; a sixth is refused", async ({ page, context }) => {
  test.setTimeout(120_000);
  await signIn(context);
  await page.goto(`/b/${STORY_BUILD_ID}/story/edit`);
  // The old address is the Story tab in edit mode (WO-117).
  await expect(page).toHaveURL(new RegExp(`/b/${STORY_BUILD_ID}/edit/story$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  // Written in the reader's own layout (WO-117): the title and line over the plate, the text in the column.
  await page.getByLabel("Title", { exact: true }).fill("The Writ");
  await page.getByLabel("A line under the title").fill("Mephala's work is done where no one is watching.");

  const story = page.getByRole("textbox", { name: "Text" });
  await story.click();
  await page.keyboard.type(P1);
  await page.keyboard.press("Enter");
  await page.keyboard.type("Skyrim was not Vvardenfell. There were no Tong halls here.");
  await page.keyboard.press("Enter");
  await page.keyboard.type("He watched the house for four nights, and went in on the fifth.");
  await page.keyboard.press("Enter");
  await page.keyboard.type("A writ is not a grudge. It is a promise made to a god.");
  await page.getByRole("toolbar", { name: "Format" }).getByRole("button", { name: "Quote" }).click();

  // Out of the quote (Enter twice), then the five images after it.
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(story.locator("blockquote p")).toHaveCount(2);
  await page.keyboard.press("Enter");
  await expect(story.locator("blockquote p")).toHaveCount(1);
  const count = page.getByRole("button", { name: /of 5 images$/ });
  await expect(count).toHaveText("0 of 5 images");
  await page.getByLabel("Add images").setInputFiles(ART.slice(0, 5));
  await expect(story.locator('img[src*=".public.blob.vercel-storage.com/dev/builds/"]')).toHaveCount(5, { timeout: 60_000 });
  await expect(count).toHaveText("5 of 5 images");
  // Between the paragraphs, not inside one or the quote.
  await expect(story.locator("blockquote img")).toHaveCount(0);
  await expect(story.locator("p").filter({ hasText: "He watched the house for four nights, and went in on the fifth." })).toHaveCount(1);
  await expect(story.locator("p").first()).toHaveText(P1);
  await expect(count).toBeDisabled();
  const captions = page.getByRole("textbox", { name: "Caption" });
  for (let i = 0; i < 5; i++) await captions.nth(i).fill(CAPTIONS[i]);

  // A sixth: refused, with the message.
  await page.getByLabel("Add images").setInputFiles(ART.slice(5));
  await expect(page.getByRole("alert").filter({ hasText: "A story can have 5 images." })).toBeVisible();
  await expect(story.locator("img")).toHaveCount(5);
  // Saved: after a reload the five images keep their captions.
  const saved = page.getByRole("region", { name: "Edit bar" }).getByRole("status");
  await expect(saved).toHaveText(/✓ Saved/, { timeout: 15_000 });
  await page.waitForTimeout(1500);
  await expect(saved).toHaveText(/✓ Saved/, { timeout: 15_000 });
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Caption" })).toHaveCount(5);
  for (let i = 0; i < 5; i++) await expect(page.getByRole("textbox", { name: "Caption" }).nth(i)).toHaveValue(CAPTIONS[i]);
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue("The Writ");
  await expect(page.getByLabel("A line under the title")).toHaveValue("Mephala's work is done where no one is watching.");
});

test("point 3: the Story in the reader (WO-116): the plate, the drop cap, the pair side by side, the quote, the viewer and the way back", async ({ page }) => {
  await page.goto(`/b/${STORY_BUILD_ID}`);
  await expect(page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Story/ })).toHaveCount(0);
  await page.getByRole("link", { name: /^Read the story/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/b/${STORY_BUILD_ID}/story$`));
  // The reader is a page in the site (WO-124).
  const story = page.getByRole("region", { name: "Reading: The Writ" });

  // The opening plate: the first image, 420px tall (WO-124), the title and the opening line over it.
  const opening = story.locator("header");
  await expect(opening.getByRole("heading", { name: "The Writ" })).toBeVisible();
  await expect(opening).toContainText("Mephala's work is done where no one is watching.");
  expect(Math.round((await opening.boundingBox())!.height)).toBe(420);

  // The first paragraph's drop cap: brass, 78px, floated.
  const cap = await story.locator("p", { hasText: "The ship from Ebonheart" }).evaluate((p) => {
    const s = getComputedStyle(p, "::first-letter");
    return { float: s.float, size: s.fontSize, family: getComputedStyle(p).fontFamily };
  });
  expect(cap.float).toBe("left");
  expect(cap.size).toBe("78px");
  expect(cap.family).toContain("Alegreya");

  // Images two and three, one after the other: side by side.
  const pair = story.locator("figure").filter({ hasText: CAPTIONS[1] }).locator("xpath=..");
  const boxes = await pair.locator("figure").evaluateAll((fs) => fs.map((f) => f.getBoundingClientRect()).map((r) => ({ top: r.top, left: r.left })));
  expect(boxes).toHaveLength(2);
  expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(1);
  expect(boxes[1].left).toBeGreaterThan(boxes[0].left + 100);
  await expect(story.locator("figcaption")).toHaveText(CAPTIONS.slice(1));

  // The quote, between two ornaments.
  const quote = story.locator("blockquote");
  await expect(quote).toContainText("A writ is not a grudge.");
  await expect(quote.locator("svg")).toHaveCount(2);

  // The viewer: ‹ ›, the arrow keys, "2 of 5", Esc.
  await story.getByRole("button", { name: "Open image 2 of 5" }).click();
  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  await expect(viewer).toContainText("2 of 5");
  await expect(viewer).toContainText(CAPTIONS[1]);
  await viewer.getByRole("button", { name: "Next image" }).click();
  await expect(viewer).toContainText("3 of 5");
  await viewer.getByRole("button", { name: "Previous image" }).click();
  await page.keyboard.press("ArrowLeft");
  await expect(viewer).toContainText("1 of 5");
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);

  // Esc closed the viewer, not the reader; the way back is to the build, on Levels.
  await expect(story).toBeVisible();
  await story.getByRole("navigation", { name: "The story" }).getByRole("link").filter({ hasText: "'s build" }).click();
  await expect(story).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`/b/${STORY_BUILD_ID}$`));
  await expect(page.locator("#level-card")).toBeVisible();
});

test("point 5: the author's builds show a small Story tag on its card", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const card = page.locator("article").filter({ has: page.getByRole("link", { name: "Sevari, a story" }) });
  await expect(card.getByText("Story", { exact: true })).toBeVisible();
});

test("point 1: a build without a Story has no way into the reader", async ({ page }) => {
  await page.goto(`/b/${SEVARI_BUILD_ID}`);
  await expect(page.getByRole("link", { name: /^Read the story/ }).first()).toHaveCount(0);
});
