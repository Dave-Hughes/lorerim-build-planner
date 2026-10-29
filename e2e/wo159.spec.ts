/**
 * WO-159: Dave's testing on 27 Oct: the home title and its entry tags, the palette's searching row, back buttons that go where they
 * say, the Playthrough tab before there is a run, and the people reads on a person's page and at the door.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { SKIPS_BUILD_ID } from "./seed";

test.describe("home", () => {
  test.use({ storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.offer", value: "done" }, { name: "planner.tour.reader", value: "done" }] }] } });

  test("the title is one line at 1440, and each New in the world entry says what it is", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const title = page.getByRole("heading", { level: 1, name: "LoreRim Planner" });
    const { height, size } = await title.evaluate((el) => ({ height: el.getBoundingClientRect().height, size: parseFloat(getComputedStyle(el).fontSize) }));
    expect(height).toBeLessThan(size * 1.2);
    const rows = page.locator("section[aria-labelledby=new] > div > div > div");
    expect(await rows.count()).toBeGreaterThan(0);
    for (const row of await rows.all()) await expect(row.getByText(/^(Quest|Quest line|Person|Place|Player report)$/)).toHaveCount(1);
    await page.screenshot({ path: "test-results/wo159-home-1440.png", fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: "test-results/wo159-home-390.png", fullPage: false });
  });
});

test.describe("search", () => {
  test("a slow search shows Searching with three embers, earlier results stay under it, and it goes when results land", async ({ page }) => {
    let slow = false;
    await page.route("**/api/search**", async (route) => {
      if (slow) await new Promise((r) => setTimeout(r, 1200));
      await route.continue();
    });
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const box = page.getByRole("dialog", { name: "Search the site" }).getByRole("combobox");
    await box.fill("lights");
    await expect(page.getByRole("listbox", { name: "Suggestions" })).toContainText("Lights Out!");
    slow = true;
    await box.fill("lights out");
    const status = page.getByRole("status").filter({ hasText: "Searching" });
    await expect(status).toBeVisible();
    await expect(status.locator("i")).toHaveCount(3);
    // The earlier results are still there under it.
    await expect(page.getByRole("listbox", { name: "Suggestions" })).toContainText("Lights Out!");
    await page.screenshot({ path: "test-results/wo159-palette-searching-1440.png" });
    await expect(status).toHaveCount(0, { timeout: 8000 });
  });

  test("with reduced motion the embers stay lit and don't move", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/api/search**", async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.getByRole("dialog", { name: "Search the site" }).getByRole("combobox").fill("whiterun");
    const embers = page.getByRole("status").filter({ hasText: "Searching" }).locator("i");
    await expect(embers).toHaveCount(3);
    for (const e of await embers.all()) expect(await e.evaluate((el) => ({ o: getComputedStyle(el).opacity, a: getComputedStyle(el).animationName }))).toEqual({ o: "1", a: "none" });
  });
});

test.describe("back buttons", () => {
  const back = (page: import("@playwright/test").Page) => page.locator("main").getByRole("link", { name: /^Back to / }).first();

  test("from outside they go to the page's home in the World and name it", async ({ page }) => {
    await page.goto("/people/lydia");
    await expect(back(page)).toHaveText("Back to People");
    await expect(back(page)).toHaveAttribute("href", "/people");
    await page.goto("/places/broken-oar-grotto");
    await expect(back(page)).toHaveText("Back to Places");
    await expect(back(page)).toHaveAttribute("href", "/places");
    await page.goto("/quests/q/lights-out");
    await expect(back(page)).toHaveAttribute("href", /^\/quests\/c\//);
    await expect(back(page)).toHaveText(/^Back to \S/);
    await page.goto("/quests/main-quest");
    await expect(back(page)).toHaveAttribute("href", /^\/quests\/c\//);
  });

  test("from a page on the site, a button goes back to it and names it; it is a square outlined button the height of the search box", async ({ page }) => {
    await page.goto("/people/lucan-valerius");
    await page.getByRole("link", { name: "The Golden Claw" }).first().click();
    await expect(page).toHaveURL(/\/quests\/q\/the-golden-claw/);
    await expect(back(page)).toHaveText(/^Back to Lucan Valerius$/);
    await expect(back(page)).toHaveAttribute("href", "/people/lucan-valerius");
    const b = (await back(page).boundingBox())!;
    const s = (await page.locator("main").getByRole("combobox").first().locator("xpath=ancestor::div[contains(@class,'box')][1]").boundingBox())!;
    expect(Math.round(b.height)).toBe(40);
    expect(Math.abs(b.height - s.height)).toBeLessThanOrEqual(2);
    expect(await back(page).evaluate((el) => getComputedStyle(el).borderRadius)).toBe("0px");
    await page.screenshot({ path: "test-results/wo159-back-1440.png", clip: { x: 0, y: 0, width: 1280, height: 220 } });
    await back(page).click();
    await expect(page).toHaveURL(/\/people\/lucan-valerius$/);
    // Back from the person goes to People, since the visitor came to it from nothing but this tab's start.
    await expect(back(page)).toBeVisible();
  });

  test("a place reached from a quest goes back to the quest, not to a search", async ({ page }) => {
    await page.goto("/quests/q/lights-out");
    await page.getByRole("link", { name: "Broken Oar Grotto" }).first().click();
    await expect(page).toHaveURL(/\/places\/broken-oar-grotto/);
    await expect(back(page)).toHaveText("Back to Lights Out!");
    await expect(back(page)).toHaveAttribute("href", "/quests/q/lights-out");
  });
});

test.describe("the Playthrough tab before there is a run", () => {
  test("the owner sees it from the start; it says what a playthrough is, and Plan a playthrough makes the run and opens it", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SKIPS_BUILD_ID}/edit`);
    const tabs = page.getByRole("navigation", { name: "Edit tabs" });
    await expect(tabs.getByRole("link", { name: /^Playthrough/ })).toBeVisible();
    await tabs.getByRole("link", { name: /^Playthrough/ }).click();
    await expect(page).toHaveURL(new RegExp(`/b/${SKIPS_BUILD_ID}/edit/play$`));
    await expect(page.getByRole("heading", { level: 1, name: "Playthrough" })).toBeVisible();
    await expect(page.getByText(/acts, each with a goal, a place and its quests/)).toBeVisible();
    await page.screenshot({ path: "test-results/wo159-playthrough-empty-1440.png" });
    await page.getByRole("button", { name: "Plan a playthrough" }).click();
    await page.waitForURL(/\/b\/[^/]+\/edit\/play/);
    await expect(page.getByRole("navigation", { name: "Edit tabs" }).getByRole("link", { name: /^Playthrough/ })).toHaveAttribute("aria-current", "page");
  });

  test("a visitor who isn't the owner has no such page", async ({ page }) => {
    await page.goto(`/b/${SKIPS_BUILD_ID}/play`);
    await expect(page).toHaveURL(new RegExp(`/b/${SKIPS_BUILD_ID}$`));
  });
});

test.describe("the people reads", () => {
  test("Lydia: where to find her, how she joins, the marriage row, what isn't sure, and the checked line", async ({ page }) => {
    await page.goto("/people/lydia");
    const where = page.getByRole("region", { name: "Where to find her" });
    await expect(where).toContainText("Dragonsreach, Whiterun");
    await expect(page.getByRole("region", { name: "What she offers" })).toContainText("As your housecarl once you're made Thane of Whiterun");
    await expect(page.getByRole("region", { name: "What she offers" })).toContainText("She is a potential spouse");
    const ic = page.getByRole("region", { name: "Information Confidence" });
    await expect(ic).toContainText("Read from the game files and checked by a second reader");
    await expect(ic.getByText("Second reader", { exact: true }).locator("xpath=preceding-sibling::span[1]")).toHaveText("✓");
    await expect(ic).toContainText("What changes where they are");
    await expect(page.locator("main")).not.toContainText(/extracts?\b/i);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `test-results/wo159-lydia-${width}.png`, fullPage: true });
    }
  });

  test("Jaree-Ra is by the Winking Skeever, not the docks, and says a player's report counted", async ({ page }) => {
    await page.goto("/people/jaree-ra");
    const where = page.getByRole("region", { name: "Where to find him" });
    await expect(where).toContainText("Solitude, by the Winking Skeever");
    await expect(where).not.toContainText(/Red Wave|docks, around|aboard/);
    await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("1 report approved");
    await page.screenshot({ path: "test-results/wo159-jaree-ra-1440.png", fullPage: true });
  });

  test("Lucan Valerius: his day in hours, what he sells, and his two quests with how each touches him", async ({ page }) => {
    await page.goto("/people/lucan-valerius");
    await expect(page.getByRole("region", { name: "Where to find him" })).toContainText("The Sleeping Giant Inn, Riverwood");
    await expect(page.getByRole("region", { name: "What he offers" })).toContainText("General goods, 7 am to 8 pm");
    await expect(page.getByRole("region", { name: "His quests" }).getByRole("link", { name: "The Golden Claw" })).toHaveAttribute("href", "/quests/q/the-golden-claw");
    await page.screenshot({ path: "test-results/wo159-lucan-1440.png", fullPage: true });
  });

  test("a person not read yet keeps what the page said before", async ({ page }) => {
    const res = await page.goto("/people/mjoll-the-lioness");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("A second reader hasn't checked this page yet");
  });

  test("the door's get_person returns the same fields, with what isn't sure and the player's report", async ({ page, context, baseURL }) => {
    await signIn(context);
    const from = ip();
    const token = (await tokenFor(page, context, baseURL!, from)).access_token;
    const lydia = (await call(baseURL!, from, token, "get_person", { name: "Lydia" })).json();
    expect(lydia.person.joins).toContain("housecarl");
    expect(lydia.person.day[0].where).toContain("Dragonsreach");
    expect(lydia.person.notSure.length).toBeGreaterThan(0);
    expect(lydia.howSure).toContain("checked by a second reader");
    const jaree = (await call(baseURL!, from, token, "get_person", { name: "Jaree-Ra" })).json();
    expect(jaree.person.firstMeet).toContain("Winking Skeever");
    expect(jaree.howSure).toContain("1 report approved");
  });
});
