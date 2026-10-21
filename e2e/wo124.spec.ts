/**
 * WO-124 Part 4: changing tab in edit never drops the frame. The Story tab linked to an address that redirected, and a
 * redirect during a tab change made Next load the whole document again: 0.8 s of an empty frame. Each tab change here
 * is sampled every 10 ms; the edit tabs are on screen in every sample.
 */
import { expect, test } from "@playwright/test";
import { KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";
import { signIn } from "./helpers";

test("changing tab in edit never drops the edit tabs, and says how long each took", async ({ page, context }) => {
  test.setTimeout(120_000);
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/edit`);
  const tabs = page.getByRole("navigation", { name: "Edit tabs" });
  await tabs.waitFor();
  const times: string[] = [];
  for (const name of ["Story", "Character", "Guide", "Story", "Playthrough", "Story", "Build"]) {
    await page.evaluate(() => {
      const w = window as unknown as { gaps: number[]; t0: number; on: boolean };
      w.gaps = [];
      w.t0 = performance.now();
      w.on = true;
      const tick = () => {
        if (!document.querySelector('nav[aria-label="Edit tabs"]')) w.gaps.push(Math.round(performance.now() - w.t0));
        if (w.on) setTimeout(tick, 10);
      };
      tick();
    });
    const t0 = Date.now();
    await tabs.getByRole("link", { name: new RegExp(`^${name}`) }).click();
    await expect(tabs.locator('[aria-current="page"]')).toContainText(name);
    const ms = Date.now() - t0;
    const gaps = await page.evaluate(() => {
      const w = window as unknown as { gaps: number[]; on: boolean };
      w.on = false;
      return w.gaps;
    });
    times.push(`${name}: ${ms} ms`);
    expect(gaps, `${name}: the edit tabs were gone at ${gaps.slice(0, 5).join(", ")} ms`).toEqual([]);
  }
  console.log(`WO-124 tab times: ${times.join(", ")}`);
});

test("the slim bar: the tabs named for what's in them, one help line each, and on a phone the tab as a menu", async ({ page, context }) => {
  await signIn(context);
  const help: [string, string, RegExp][] = [
    [`/b/${KYRIA_BUILD_ID}/setup?step=name`, "Character", /^Who she is at level 1: race, birthsign, traits and starting skills/],
    [`/b/${KYRIA_BUILD_ID}/edit`, "Build", /^Each level: where the skill points go and which perks she takes\./],
    [`/b/${KYRIA_BUILD_ID}/guide`, "Guide", /^How to play her, in your words\. Readers find it under Guide\.$/],
    [`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/title`, "Story", /^Her story in chapters\. A chapter tied to an objective stays locked until that objective is done\.$/],
    [`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`, "Playthrough", /^Her run through the game: acts, and the objectives in each\./],
  ];
  for (const [path, tab, line] of help) {
    await page.goto(path);
    const bar = page.getByRole("region", { name: "Edit bar" });
    await expect(bar.getByRole("navigation", { name: "Edit tabs" }).locator('[aria-current="page"]')).toHaveText(tab);
    await expect(page.getByText(line)).toBeVisible();
    // 64px, under the site header, which stays above it.
    expect(Math.round((await bar.boundingBox())!.height)).toBe(65);
    await expect(page.locator("header").first()).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/b/${KYRIA_BUILD_ID}/edit`);
  const bar = page.getByRole("region", { name: "Edit bar" });
  await expect(bar.getByRole("navigation", { name: "Edit tabs" })).toBeHidden();
  await bar.getByRole("button", { name: "Build: the edit tabs" }).click();
  await page.getByRole("menu", { name: "Edit tabs" }).getByRole("menuitem", { name: "Guide" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/guide$`));
  await expect(bar.getByRole("link", { name: "Done" })).toBeVisible();
});

test("the step you're on is lit, a step that needs you is brass with !, and every i sits 6px after its label", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/setup?step=name`);
  const now = page.getByRole("complementary", { name: "Setup steps" }).locator('[aria-current="step"]');
  await expect(now).toHaveCSS("background-color", "rgb(28, 36, 48)");
  await expect(now).toHaveCSS("box-shadow", /rgb\(240, 145, 63\) 3px 0px 0px 0px inset/);
  // The "i" after Cover: its circle 6px after the word.
  const gap = await page.locator("#cover .label").evaluate((label) => {
    const range = document.createRange();
    range.selectNodeContents(label.firstChild!);
    const word = range.getBoundingClientRect();
    const circle = label.querySelector(".tip > button > span")!.getBoundingClientRect();
    return Math.round(circle.left - word.right);
  });
  expect(gap).toBe(6);
});

test("Play shows her story's card at the top of the rail, and the reader on a phone folds its contents into a button", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}`);
  const card = page.getByRole("link", { name: /^Her story: / });
  await expect(card).toContainText("Her story");
  // Continue, Start reading before any is read, or Read it again once every open one is.
  await expect(card).toContainText(/Continue: .+ ›|Start reading ›|Read it again ›/);
  await card.click();
  await expect(page.getByRole("region", { name: /^Reading: / })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  const contents = page.getByRole("navigation", { name: "Contents" });
  await expect(contents).toBeHidden();
  await page.getByRole("button", { name: "Contents" }).click();
  await expect(contents).toBeVisible();
});
