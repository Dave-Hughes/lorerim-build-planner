/**
 * WO-154 Part 4: Dave's review of the new pages. Whole-name links, the place and no hours, no player's name, the choices layout, the danger
 * column, UESP and mods, the report as a modal, the header's name, search as you type and the command palette, and the landing pages.
 */
import { expect, test } from "@playwright/test";

test("a link goes on a whole place name or none, and the quest page has the place and not the hours", async ({ page }) => {
  await page.goto("/quests/q/the-golden-claw");
  const start = page.getByRole("region", { name: "How to start it" });
  await expect(start).toContainText("Lucan Valerius");
  // No link on the front of "Riverwood Trader".
  const broken = await start.locator("a").evaluateAll((as) => as.filter((a) => (a.nextSibling?.textContent ?? "").startsWith(" Trader")).map((a) => a.textContent));
  expect(broken).toEqual([]);
  await expect(start).not.toContainText(/\b\d+(:\d+)?\s*(am|pm)\b|\bfor \d+ hours\b/i);
});

test("no player's name on a page, ever", async ({ page }) => {
  for (const url of ["/quests/q/lights-out", "/quests/q/running-wild", "/quests/q/paragliding-in-skyrim", "/quests/capital-whiterun"]) {
    await page.goto(url);
    const text = await page.locator("main").innerText();
    expect(text, url).not.toMatch(/\bDave\b|\bKyria\b/);
  }
  await page.goto("/quests/q/lights-out");
  // A player's input is a count in Information Confidence, never a sentence about what they reported (WO-157).
  await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("1 report approved");
  await expect(page.getByRole("region", { name: "How to start it" })).not.toContainText("A player's report");
});

test("The Book of Love: its steps once, then its choices, not a second list that looks unfinished", async ({ page }) => {
  await page.goto("/quests/q/the-book-of-love");
  await expect(page.getByRole("region", { name: "The steps" })).toContainText("Return to Dinya Balu");
  await expect(page.getByRole("region", { name: "The choices" })).toContainText("Pay Yngvar for a poem");
  await expect(page.getByRole("heading", { name: /ways? to finish it/ })).toHaveCount(0);
  await expect(page.getByText("Every way takes these steps")).toHaveCount(0);
  // A place the read doesn't know is said so, and a quest from a mod links to its page and the mod to Nexus.
  await expect(page.locator("main")).not.toContainText(/wherever/i);
  const opens = page.getByRole("region", { name: /What it (opens|closes)/ });
  await expect(opens.getByRole("link", { name: /Fastred's Choice/ }).first()).toHaveAttribute("href", /\/quests\/q\//);
  await expect(opens.locator('a[href*="nexusmods.com"]').first()).toHaveAttribute("target", "_blank");
});

test("how sure: UESP explained; where it takes you: a Danger label only on a place that is a fight; the report is a modal", async ({ page }) => {
  await page.goto("/quests/q/lights-out");
  await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("UESP (the Elder Scrolls wiki)");
  await expect(page.getByRole("region", { name: "Where it takes you" }).getByText("Danger", { exact: true }).first()).toBeVisible();
  await page.goto("/quests/q/the-book-of-love");
  // Its places are towns and houses: no danger cell, and no line saying danger isn't known (WO-165's second review).
  await expect(page.getByRole("region", { name: "Where it takes you" })).not.toContainText("How dangerous these places are isn't known yet.");
  await expect(page.getByRole("region", { name: "Where it takes you" }).getByText("Danger", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Report a mistake" }).click();
  const dialog = page.getByRole("dialog", { name: "Report a mistake" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Sign in with Discord to tell us.");
});

test("the header says LoreRim Planner", async ({ page }) => {
  await page.goto("/quests");
  await expect(page.getByRole("banner").getByRole("link", { name: "LoreRim Planner" })).toBeVisible();
});

test("search shows suggestions as you type, then opens the one you choose; the results page says why each matched", async ({ page }) => {
  await page.goto("/quests");
  const box = page.getByRole("main").getByRole("combobox").first();
  await box.fill("Palonimo");
  const list = page.getByRole("listbox", { name: "Suggestions" });
  await expect(list).toContainText("Running Wild");
  await box.press("ArrowDown");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/quests\/q\//);

  await page.goto("/quests");
  await page.getByRole("main").getByRole("combobox").first().fill("Brynjolf");
  await page.getByRole("main").getByRole("combobox").first().press("Enter");
  await expect(page).toHaveURL(/\/search\?q=Brynjolf/);
  await expect(page.getByRole("region", { name: "People" })).toContainText("Matches the name");
  await expect(page.getByRole("region", { name: "Quests" })).toContainText(/gives it|is named in it|Matches the quest's name/);
});

test("the command palette: Ctrl+K or the header's Search opens one box for quests, people, places, builds and the guide", async ({ page }) => {
  await page.goto("/quests");
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Search the site" });
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("Lights Out");
  await expect(palette.getByRole("listbox")).toContainText("Lights Out!");
  await palette.getByRole("combobox").press("ArrowDown");
  await palette.getByRole("combobox").press("Enter");
  await expect(page).toHaveURL(/\/quests\/q\/lights-out$/);
  await page.keyboard.press("Escape");
  await page.getByRole("banner").getByRole("button", { name: "Search the site" }).click();
  await expect(page.getByRole("dialog", { name: "Search the site" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Search the site" })).toBeHidden();
});

test("the Quests page: Everything else, by place stays in its panel at 1440 and 390", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests");
    const rest = page.getByRole("region", { name: "Everything else, by place" });
    const box = await rest.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo154p4-quests-${width}.png`, fullPage: true });
  }
});

test("People: groups from the records, each a few names and all N; a group opens its list", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/people");
    for (const g of ["Followers", "Spouses", "Merchants", "Trainers", "Innkeepers", "Quest givers"]) await expect(page.getByRole("heading", { name: g, level: 2 })).toBeVisible();
    await page.screenshot({ path: `test-results/wo154p4-people-${width}.png`, fullPage: true });
  }
  await page.goto("/people?group=followers");
  await expect(page.getByRole("link", { name: "Mjoll the Lioness" })).toBeVisible();
  await page.goto("/people?group=followers&town=Riften");
  await expect(page.getByRole("link", { name: "Mjoll the Lioness" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lydia" })).toHaveCount(0);
});

test("Places: holds as compact sections; a kind of place opens all of them", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/places");
    await expect(page.getByRole("heading", { name: "Haafingar", level: 2 })).toBeVisible();
    await expect(page.getByRole("link", { name: /^All \d+ ›$/ }).first()).toBeVisible();
    await page.screenshot({ path: `test-results/wo154p4-places-${width}.png`, fullPage: true });
  }
  await page.goto("/places");
  // About ten kinds a player would pick (WO-167 review), each with its count; the old raw type still lands on its group.
  const kinds = page.getByLabel("Kinds of place").getByRole("link");
  expect(await kinds.count()).toBeLessThanOrEqual(11);
  await page.getByRole("link", { name: /^Inns and shops/ }).first().click();
  await expect(page).toHaveURL(/type=inns/);
  await expect(page.getByRole("heading", { name: /All inns and shops/i })).toBeVisible();
  await page.goto("/places?type=Inn");
  await expect(page.getByRole("heading", { name: /All inns and shops/i })).toBeVisible();
});
