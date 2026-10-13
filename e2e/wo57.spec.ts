import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { FORTY_BUILD_ID, FOUR_BUILD_ID, IRIEL_BUILD_ID, NOVICE_DESTRUCTION_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** The +N shown in a skill's stepper at this level. */
const raised = (page: Page, skill: string) => page.getByRole("button", { name: `Raise ${skill}` }).locator("..");

test("Add shout lists every shout before anything is typed; the mouse moves the highlight and Enter adds it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=10`);
  const shouts = page.getByRole("region", { name: "Shouts", exact: true });
  await shouts.getByRole("button", { name: "Add shout" }).click();
  const list = shouts.getByRole("listbox", { name: "Shouts" });
  await expect(list).toBeVisible();
  const options = list.getByRole("option");
  // A to Z: Aura Whisper first.
  await expect(options.first()).toContainText("Aura Whisper");
  // The mouse and the keys share one highlight.
  await options.nth(2).hover();
  await expect(options.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(options.first()).toHaveAttribute("aria-selected", "false");
  const text = (await options.nth(2).textContent())!;
  await page.keyboard.press("Enter");
  const name = await shouts.getByRole("combobox", { name: "Shout" }).inputValue();
  expect(name.length).toBeGreaterThan(0);
  expect(text.startsWith(name)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(shouts.getByRole("listitem")).toContainText(name);
});

test("Add spell, with nothing typed, starts with the build's own school: Destruction after Novice Destruction", async ({ page, context }) => {
  await signIn(context);
  // A build of its own: WO-42's test takes more school perks on the shared spells build.
  await page.goto(`/b/${NOVICE_DESTRUCTION_BUILD_ID}/edit?level=1`);
  const spells = page.getByRole("region", { name: "Spells", exact: true });
  await spells.getByRole("button", { name: "Add spell" }).click();
  const options = spells.getByRole("listbox", { name: "Spells" }).getByRole("option");
  await expect(options.first()).toContainText("Destruction");
  for (let i = 0; i < 5; i++) await expect(options.nth(i)).toContainText("Destruction, Novice");
});

test("Continue and repeat on level 4 makes level 5 with level 4's attribute and skill points", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FOUR_BUILD_ID}/edit?level=4`);
  await page.getByRole("button", { name: "Continue and repeat" }).click();
  await expect(page).toHaveURL(/level=5/);
  await expect(page.getByText("Level 5 follows every rule.")).toBeVisible();
  const col = page.getByRole("region", { name: "Attribute and skills" });
  await expect(col.getByRole("group", { name: "Attribute" }).getByRole("button", { name: /^Stamina/ })).toHaveAttribute("aria-pressed", "true");
  for (const sk of ["One-Handed", "Heavy Armor", "Smithing"]) await expect(raised(page, sk)).toContainText("+5");
  await expect(col.getByRole("button", { name: "Undo" })).toBeVisible();
});

test("the Main spell star and the Oghma Infinium explain themselves on hover and focus", async ({ page, context }) => {
  await signIn(context);
  // The 4-level build: WO-44's test reads the Oghma on the shared builds.
  await page.goto(`/b/${FOUR_BUILD_ID}/edit?level=3`);
  const spells = page.getByRole("region", { name: "Spells", exact: true });
  await spells.getByRole("button", { name: "Add spell" }).click();
  await spells.getByRole("combobox", { name: "Spell" }).fill("Flames");
  await spells.getByRole("option").first().click();
  await spells.getByRole("button", { name: "Add", exact: true }).click();
  const star = spells.getByRole("button", { name: "Main spell: Flames" });
  await star.hover();
  await expect(page.getByRole("tooltip")).toContainText("the spells this build casts most");
  await page.mouse.move(0, 0);
  // Keyboard focus (a key first, so the browser treats the focus as keyboard focus).
  await page.keyboard.press("Shift");
  await star.focus();
  await expect(page.getByRole("tooltip")).toContainText("Up to 8.");

  // The label's focusable wrapper (the text inside it isn't focusable itself).
  const oghma = page.getByRole("group", { name: "Oghma Infinium" }).locator("[tabindex='0']").first();
  await oghma.hover();
  await expect(page.getByRole("tooltip").filter({ hasText: "Septimus Signus" })).toBeVisible();
  await page.mouse.move(0, 0);
  await page.keyboard.press("Shift");
  await oghma.focus();
  await expect(page.getByRole("tooltip").filter({ hasText: "Hermaeus Mora gives 3 perk points" })).toBeVisible();
});

test.describe("at 1600", () => {
  test.use({ viewport: { width: 1600, height: 1000 } });
  test("the contents rail lists only the tab's own sections", async ({ page }) => {
    await page.goto(`/b/${IRIEL_BUILD_ID}?level=10`);
    const rail = page.getByRole("navigation", { name: "On this page" });
    await expect(rail).toBeVisible();
    await expect(rail.getByRole("link", { name: /^Perks/ })).toBeVisible();
    await expect(rail.getByRole("link", { name: "Guide", exact: true })).toHaveCount(0);
    await page.getByRole("tab", { name: /^Guide/ }).click();
    // Iriel's guide has headings that start "Levels…": the tab entry was named just "Levels".
    await expect(rail.getByRole("link", { name: "Levels", exact: true })).toHaveCount(0);
  });
});
