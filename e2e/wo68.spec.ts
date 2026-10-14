import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { FRESH_MAGE_BUILD_ID, REPORTER_TOKENS, SNAPSHOT_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 1040 } });

/** Makes a build through Set up as one of WO-40's reporters (the test author is at the day's limit). */
async function newBuild(page: Page, name: string) {
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Altmer" }).getByRole("button", { name: /^Choose/ }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await page.goto("/new?step=name");
  await page.getByLabel("Build name").fill(name);
  await page.getByRole("button", { name: "Create build" }).click();
  await page.waitForURL(/\/b\/\w{10}\/edit/);
  await expect(page.getByRole("heading", { name: "How do you want to build it?" })).toBeVisible();
  await expect(page.getByText("Auto level")).toHaveCount(0);
}

test.describe("a new build", () => {
  // The author's tour isn't done in this browser, so Level by level can start it.
  test.use({ storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.reader", value: "done" }, { name: "planner.tour.snapshot", value: "done" }] }] } });

  test("Snapshot: Expert Destruction at 20 raises the level to 25, and Save snapshot lands on the build page", async ({ page, context }) => {
    await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[0], domain: "localhost", path: "/" }]);
    await newBuild(page, "Snapshot Mage");
    await page.getByRole("button", { name: /^Snapshot/ }).click();
    await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Snapshot" })).toBeVisible();
    await page.getByRole("button", { name: "20", exact: true }).click();
    await expect(page.getByLabel("Level", { exact: true })).toHaveValue("20");
    await page.getByRole("button", { name: "Destruction", exact: true }).click();
    await page.locator('[data-perk="Destruction:Expert Destruction"]').click();
    await expect(page.getByLabel("Level", { exact: true })).toHaveValue("25");
    await expect(page.getByRole("status").filter({ hasText: "Level raised to 25 for Expert Destruction." })).toBeVisible();
    await expect(page.getByRole("button", { name: "20", exact: true })).toBeDisabled();
    await expect(page.locator('[data-goal="Destruction:Expert Destruction"]')).toContainText("Auto selected: Novice Destruction, Apprentice Destruction, Adept Destruction");

    await page.getByRole("button", { name: "Save snapshot" }).first().click();
    await page.waitForURL(/\/b\/\w{10}$/);
    await expect(page.getByText("Snapshot at level 25").first()).toBeVisible();
    const perks = page.locator("#snapshot-perks");
    for (const p of ["Novice Destruction", "Apprentice Destruction", "Adept Destruction", "Expert Destruction"]) await expect(perks).toContainText(p);
    const destruction = page.locator("#snapshot-skills li").filter({ hasText: /^Destruction/ });
    expect(Number(await destruction.locator("b").textContent())).toBeGreaterThanOrEqual(75);
    // No level stepper, ruler or level cards.
    await expect(page.getByRole("button", { name: "Next level" })).toHaveCount(0);
  });

  test("Level by level opens level 1 with the author's tour, and no Auto level anywhere", async ({ page, context }) => {
    await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[0], domain: "localhost", path: "/" }]);
    await newBuild(page, "Level Mage");
    await page.getByRole("button", { name: /^Level by level/ }).click();
    await expect(page.getByRole("dialog", { name: "Build saved!" })).toBeVisible();
    await page.getByRole("dialog", { name: "Build saved!" }).getByRole("button", { name: "Later" }).click();
    await expect(page.getByText("Level", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Auto level/ })).toHaveCount(0);
  });
});

test("ruled out: with Weapons Master picked, Weapon Mastery and what needs it can't be picked, and say why; counters and set values keep within the rules", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_MAGE_BUILD_ID}/edit?start=choose`);
  await page.getByRole("button", { name: /^Snapshot/ }).click();
  await page.getByRole("button", { name: "Block", exact: true }).click();
  await page.locator('[data-perk="Block:Weapons Master"]').click();
  await expect(page.locator('[data-goal="Block:Weapons Master"]')).toBeVisible();

  await page.getByRole("button", { name: "One-Handed", exact: true }).click();
  const mastery = page.locator('[data-perk="One-Handed:Weapon Mastery"]');
  await expect(mastery).toHaveAttribute("data-mark", "ruled");
  await expect(mastery).toHaveAttribute("aria-disabled", "true");
  await mastery.hover();
  await expect(mastery).toContainText("Not with Block: Weapons Master, a perk you picked.");
  await mastery.click({ force: true });
  await expect(mastery).toHaveAttribute("data-mark", "ruled");
  await expect(page.locator('[data-goal="One-Handed:Weapon Mastery"]')).toHaveCount(0);
  const further = page.locator('[data-perk="One-Handed:Penetrating Strikes"]');
  await expect(further).toHaveAttribute("data-mark", "ruled");
  await expect(further).toHaveAttribute("aria-label", /It needs Weapon Mastery, which that rules out\./);

  // The attribute counters always show: a preset fills them, a hand edit unlights it, a new level keeps the total.
  const count = async (a: string) => Number(await page.getByLabel(`${a} level-ups`).textContent());
  const total = async () => (await count("Health")) + (await count("Magicka")) + (await count("Stamina"));
  await expect(page.getByRole("button", { name: "Magicka first" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Stamina first" }).click();
  expect(await count("Stamina")).toBe(25);
  await page.getByRole("button", { name: "More Health" }).click();
  await expect(page.getByRole("button", { name: "Stamina first" })).toHaveAttribute("aria-pressed", "false");
  expect(await total()).toBe(49);
  await page.getByRole("button", { name: "30", exact: true }).click();
  expect(await total()).toBe(29);

  // A set skill value past what the level and points allow snaps back, and says so.
  const field = page.getByLabel("Illusion at level 30");
  await field.fill("95");
  await field.press("Enter");
  await expect(page.getByRole("status").filter({ hasText: /^Most it can be with the others: \d+\.$/ })).toBeVisible();
  expect(Number(await field.inputValue())).toBeLessThanOrEqual(80);
});

test("Browse's Kind filter: Snapshot lists the snapshot and not the level builds", async ({ page }) => {
  await page.goto("/?kind=snapshot");
  await expect(page.getByRole("link", { name: "Altmer Battlemage Snapshot" })).toBeVisible();
  await expect(page.getByText("Snapshot at level 50").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Test Shield-Wall" })).toHaveCount(0);
  await page.goto("/?kind=levels");
  await expect(page.getByRole("link", { name: "Test Shield-Wall" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Altmer Battlemage Snapshot" })).toHaveCount(0);
  await expect(page.getByLabel("Kind")).toHaveValue("levels");
});

test.describe("Tapps' tour of the snapshot editor", () => {
  test.use({ storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.reader", value: "done" }, { name: "planner.tour.author", value: "done" }] }] } });

  test("a fresh browser gets the six-stop tour; skipping it doesn't bring it back; Show me around does", async ({ page, context }) => {
    await signIn(context, "other");
    await page.goto(`/b/${SNAPSHOT_BUILD_ID}/edit`);
    const welcome = page.getByRole("dialog", { name: "Snapshot" });
    await expect(welcome).toContainText("Shows a build at one level: its skills, attributes and perks.");
    await welcome.getByRole("button", { name: "Show me" }).click();
    await expect(page.getByRole("dialog", { name: "At level" })).toContainText("1 of 5");
    await page.getByRole("dialog", { name: "At level" }).getByRole("button", { name: "Next" }).click();
    await page.getByRole("dialog", { name: "Attributes" }).getByRole("button", { name: "Skip" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("button", { name: "Save snapshot" }).first()).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: /account menu$/ }).click();
    await page.getByRole("menuitem", { name: "Show me around" }).click();
    for (const title of ["At level", "Attributes", "Pick perks", "Skills"]) await page.getByRole("dialog", { name: title }).getByRole("button", { name: "Next" }).click();
    await expect(page.getByRole("dialog", { name: "Save snapshot" })).toContainText("Save the snapshot, then write the Guide.");
    await page.getByRole("dialog", { name: "Save snapshot" }).getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
