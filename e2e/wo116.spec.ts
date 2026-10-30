/**
 * WO-116: Play is the page; the story opens in a reader. A build alone has Levels and Guide and Read
 * the story; a character with a run opens on Play; the tab row pins; Read Act I opens the reader at
 * its own address and Back returns to the same spot with the card now one line; a Story marker opens
 * its entry and In the game comes back to the row; previous and next walk the tale and stop at a
 * waiting beat; New character is Set up; Start a run from the hero and the card; the browser's back
 * closes the reader; ticking the hunt opens Made with Care; and the door's act chapter.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, FRESH_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

test.describe.configure({ mode: "serial" });
test.use({ viewport: { width: 1440, height: 900 } });

const KYRIA = `/p/${KYRIA_PLAYTHROUGH_ID}`;
const tabs = (page: Page) => page.getByRole("tablist", { name: "Build sections" });

test("a character with a run opens on Play, from its build's address too; another player sees it too (a character has one visibility)", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page).getByRole("tab")).toHaveCount(3);
  // WO-181: no line of where she is in your game while progress tracking is off.
  await expect(page.getByLabel("Where she is")).toHaveCount(0);
  // A character opens on Play from every way in (WO-117), its build's own address too.
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  // The Build tab is the build's own page (WO-164): the old Build address, and ?tab=levels, go there.
  await page.goto(`${KYRIA}/build`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=levels$`));
  await expect(tabs(page).getByRole("tab", { name: /^Build/ })).toHaveAttribute("aria-selected", "true");

  await context.clearCookies();
  await signIn(context, "other");
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
  // Kyria's character is Link only and her run was seeded Only you: the run follows the character (WO-179 Part 2), so a visitor with the link has Play.
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveCount(1);
});

test("the tab row pins as a thin bar with the name and the tabs, on every tab", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const pinned = page.getByRole("region", { name: "Pinned bar" });
  await expect(pinned).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(pinned.getByText("Kyria, Knight of Stendarr")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Playthrough" })).toHaveAttribute("aria-pressed", "true");
  // A tab picked there opens at its top, the tab row back in view; scrolled down again, the bar is the same.
  await pinned.getByRole("button", { name: "Build" }).click();
  await expect(tabs(page).getByRole("tab", { name: /^Build/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page)).toBeInViewport();
  await page.getByRole("region", { name: /^Perks at level/ }).scrollIntoViewIfNeeded();
  await expect(pinned.getByText("Kyria, Knight of Stendarr")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Build" })).toHaveAttribute("aria-pressed", "true");
});

test("New character lands in Set up, with no question first", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/new");
  await expect(page.getByRole("heading", { name: "Choose a race" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What are you making?" })).toHaveCount(0);
  await expect(page.getByText("The run", { exact: true })).toHaveCount(0);
});

test("Start a run, from the hero and from the card", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: "Jo'Vashar", exact: true }) });
  await expect(card.getByRole("link", { name: /^Plan a playthrough/ })).toHaveAttribute("href", `/b/${FRESH_BUILD_ID}/run`);
  await page.goto(`/b/${FRESH_BUILD_ID}`);
  await page.getByRole("link", { name: "Plan a playthrough" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/run$`));
  await expect(page.getByRole("heading", { name: "The run" })).toBeVisible();
});

// WO-116a: one pinned bar, not two: the name, the page's own tabs, and the owner's controls.
for (const [what, path, tabNames, owner] of [
  ["a build alone", `/b/${AZREM_BUILD_ID}`, ["Playthrough", "Build", "Guide"], "other"],
  ["a character", KYRIA, ["Playthrough", "Build", "Guide"], "author"],
] as const) {
  test(`scrolled on ${what}, exactly one bar pins, with its own tabs, no Story tab, and the owner's controls`, async ({ page, context }) => {
    await signIn(context, owner);
    await page.goto(path);
    await expect(page.getByRole("region", { name: "Edit bar" })).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 1600));
    const pinned = page.getByRole("region", { name: "Pinned bar" });
    await expect(pinned).toHaveCount(1);
    // Nothing else is pinned to the top of the window.
    const stuck = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => { const s = getComputedStyle(el); return (s.position === "fixed" || s.position === "sticky") && el.getBoundingClientRect().top <= 1 && el.getBoundingClientRect().height > 20 && el.getBoundingClientRect().bottom > 0; }).length);
    expect(stuck).toBe(1);
    await expect(pinned.getByRole("group", { name: "Sections" }).getByRole("button")).toHaveText([...tabNames]);
    await expect(pinned.getByText(/^Story$/)).toHaveCount(0);
    await expect(pinned.getByRole("button", { name: /^Who can see it/ })).toBeVisible();
    await expect(pinned.getByRole("button", { name: "Copy link" })).toBeVisible();
    await expect(pinned.getByRole("link", { name: "Edit", exact: true })).toHaveAttribute("href", new RegExp("/b/[a-z0-9]{10}/edit(/play)?$"));
  });
}
