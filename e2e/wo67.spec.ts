import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { FRESH_MAGE_BUILD_ID, REPORTER_TOKENS } from "./seed";

test.use({ viewport: { width: 1440, height: 1000 } });

/** Makes a build through Set up as one of WO-40's reporters (the test author is at the day's limit). */
async function newBuild(page: Page, name: string) {
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Breton" }).getByRole("button", { name: /^Choose/ }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await page.goto("/new?step=name");
  await page.getByLabel("Build name").fill(name);
  await page.getByRole("button", { name: "Create build" }).click();
  await page.waitForURL(/\/b\/\w{10}\/edit/);
}

test.describe("a new build", () => {
  // The author's tour isn't done in this browser, so Level by level can start it.
  test.use({ storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.reader", value: "done" }, { name: "planner.tour.autolevel", value: "done" }] }] } });

  test("asks how to build it: Auto level opens its page; Level by level opens level 1 with the author's tour", async ({ page, context }) => {
    await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[0], domain: "localhost", path: "/" }]);
    await newBuild(page, "Choice Auto");
    await expect(page.getByRole("heading", { name: "How do you want to build it?" })).toBeVisible();
    await page.getByRole("button", { name: /^Auto level/ }).click();
    await expect(page.getByRole("heading", { name: "Auto level", exact: true })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Build saved!" })).toHaveCount(0);

    await newBuild(page, "Choice Levels");
    await page.getByRole("button", { name: /^Level by level/ }).click();
    await expect(page.getByRole("dialog", { name: "Build saved!" })).toBeVisible();
    await page.getByRole("dialog", { name: "Build saved!" }).getByRole("button", { name: "Later" }).click();
    // Level 1, with Auto level beside the stepper as well as in the footer.
    await expect(page.getByText("Level", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Auto level", exact: true })).toHaveCount(2);
    // A reload doesn't ask again.
    await page.reload();
    await expect(page.getByRole("heading", { name: "How do you want to build it?" })).toHaveCount(0);
  });
});

test("a goal out of reach raises the level, with Undo", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_MAGE_BUILD_ID}/edit`);
  await page.getByRole("button", { name: "Auto level", exact: true }).first().click();
  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: "Destruction", exact: true }).click();
  await page.locator('[data-perk="Destruction:Expert Destruction"]').click();

  await expect(page.getByLabel("Level to reach")).toHaveValue("25");
  await expect(page.getByRole("status").filter({ hasText: "Level raised to 25 for Expert Destruction." })).toBeVisible();
  await expect(page.getByRole("button", { name: "10", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "20", exact: true })).toBeDisabled();
  await expect(page.locator('[data-goal="Destruction:Expert Destruction"]')).toContainText("Level 25");
  await expect(page.getByRole("button", { name: "Auto level to 25" }).first()).toBeEnabled();

  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByLabel("Level to reach")).toHaveValue("10");
  await expect(page.locator("[data-goal]")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "10", exact: true })).toBeEnabled();
});

test("the attribute counters always show: a preset fills them, a hand edit unlights it, a new level keeps the total", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_MAGE_BUILD_ID}/edit`);
  await page.getByRole("button", { name: "Auto level", exact: true }).first().click();
  const count = async (a: string) => Number(await page.getByLabel(`${a} level-ups`).textContent());
  const total = async () => (await count("Health")) + (await count("Magicka")) + (await count("Stamina"));
  // The Altmer's first major is Destruction: Magicka first, lit.
  await expect(page.getByRole("button", { name: "Magicka first" })).toHaveAttribute("aria-pressed", "true");
  expect(await count("Magicka")).toBe(10);
  expect(await total()).toBe(19);
  await page.getByRole("button", { name: "Stamina first" }).click();
  expect(await count("Stamina")).toBe(10);
  await page.getByRole("button", { name: "More Health" }).click();
  await expect(page.getByRole("button", { name: "Stamina first" })).toHaveAttribute("aria-pressed", "false");
  expect(await total()).toBe(19);
  await page.getByRole("button", { name: "30", exact: true }).click();
  expect(await total()).toBe(29);
  await expect(page.getByText(/Comes along|Left over|Custom/)).toHaveCount(0);
});

test.describe("Tapps' tour of Auto level", () => {
  test.use({ storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.reader", value: "done" }, { name: "planner.tour.author", value: "done" }] }] } });

  test("a fresh browser gets the six-stop tour; skipping it doesn't bring it back; Show me around does", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${FRESH_MAGE_BUILD_ID}/edit`);
    await page.getByRole("button", { name: "Auto level", exact: true }).first().click();
    const welcome = page.getByRole("dialog", { name: "Auto level" });
    await expect(welcome).toContainText("Fast-tracks a build.");
    await welcome.getByRole("button", { name: "Show me" }).click();
    for (const [n, title] of [
      [1, "Level to reach"],
      [2, "Attributes"],
      [3, "Pick perks"],
      [4, "Skills"],
      [5, "Auto level to 20"],
    ] as const) {
      const card = page.getByRole("dialog", { name: title });
      await expect(card).toContainText(`${n} of 5`);
      if (n === 2) {
        await card.getByRole("button", { name: "Skip" }).click();
        break;
      }
      await card.getByRole("button", { name: "Next" }).click();
    }
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.reload();
    await page.getByRole("button", { name: "Auto level", exact: true }).first().click();
    await expect(page.getByRole("heading", { name: "Auto level", exact: true })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.getByRole("button", { name: /account menu$/ }).click();
    await page.getByRole("menuitem", { name: "Show me around" }).click();
    await expect(page.getByRole("dialog", { name: "Level to reach" })).toContainText("1 of 5");
    for (const title of ["Level to reach", "Attributes", "Pick perks", "Skills"]) await page.getByRole("dialog", { name: title }).getByRole("button", { name: "Next" }).click();
    await page.getByRole("dialog", { name: "Auto level to 20" }).getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
