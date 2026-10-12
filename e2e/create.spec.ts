import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("creating a build", () => {
  test("walks the steps, keeps a draft, and saves once signed in", async ({ page, context }) => {
    await page.goto("/new");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a race");
    await expect(page.getByRole("button", { name: "Next: Birthsign" })).toBeDisabled();
    // Clicking anywhere on a card chooses it, not just its button.
    await page.getByRole("article").filter({ hasText: "Nord" }).getByText("+15").click();
    await expect(page.getByRole("article").filter({ hasText: "Nord" }).getByRole("button", { name: "Chosen" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("complementary", { name: "Setup steps" }).getByText("Nord")).toBeVisible();
    await expect(page.getByText("Starting point")).toBeVisible();
    await page.getByRole("button", { name: "Next: Birthsign" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a birthsign");
    const lord = page.getByRole("article").filter({ hasText: "The Lord" });
    await lord.getByRole("button", { name: "Choose" }).click();
    await expect(lord.getByRole("button", { name: "Chosen" })).toHaveAttribute("aria-pressed", "true");
    // No sign is its own card; choosing it (or another sign) replaces the chosen one.
    await page.getByRole("heading", { name: "No birthsign yet" }).click();
    await expect(lord.getByRole("button", { name: "Choose" })).toHaveAttribute("aria-pressed", "false");
    await lord.getByRole("heading", { name: "The Lord" }).click();
    await expect(lord.getByRole("button", { name: "Chosen" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Next: Skills" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose major and minor skills");
    for (const s of ["Heavy Armor", "Block", "One-Handed"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Major" }).click();
    await expect(page.getByRole("group", { name: "Smithing" }).getByRole("button", { name: "Major" })).toBeDisabled();
    for (const s of ["Smithing", "Alchemy"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Minor" }).click();
    const tiles = page.getByRole("main").getByText(/^(Majors|Minors) \+\d+/);
    await expect(tiles).toHaveText(["Majors +10, full", "Minors +5"]);
    await expect(page.getByRole("main").getByText("3 of 3")).toBeVisible();
    await expect(page.getByRole("main").getByText("2 of 6")).toBeVisible();
    // Heavy Armor: 10 base + 10 Nord + 10 major = 30
    await expect(page.getByRole("complementary", { name: "Setup steps" })).toContainText("Heavy Armor30");
    await page.getByRole("button", { name: "Next: Traits" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose up to two traits");
    await page.getByLabel("Search 69 traits").fill("standing still");
    await page.getByRole("article").filter({ hasText: "Bulwark" }).getByRole("button", { name: "Choose" }).click();
    await expect(page.getByRole("main").getByText("1 of 2 chosen")).toBeVisible();
    await page.getByLabel("Search 69 traits").fill("");
    await page.getByRole("article").filter({ hasText: "Witcher" }).getByRole("heading", { name: "Witcher" }).click();
    await expect(page.getByRole("main").getByText("2 of 2 chosen")).toBeVisible();
    const hoarder = page.getByRole("article").filter({ hasText: "Hoarder" });
    await expect(hoarder.getByRole("button", { name: "Choose" })).toBeDisabled();
    await hoarder.getByRole("heading", { name: "Hoarder" }).click();
    await expect(page.getByRole("main").getByText("2 of 2 chosen")).toBeVisible();
    await page.getByRole("button", { name: "Next: Mode and start" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Game mode and start");
    await page.getByRole("article").filter({ hasText: "Konahrik" }).getByRole("heading", { name: "Konahrik" }).click();
    await expect(page.getByRole("article").filter({ hasText: "Konahrik" }).getByRole("button", { name: "Chosen" })).toBeVisible();
    // The game's starts (WO-29): pick one, then its hold.
    await page.getByLabel("Out in the Wilderness").check();
    await page.getByLabel("Hold").selectOption("Falkreath");
    await page.getByRole("button", { name: "Next: Details" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Name the build");
    await page.getByLabel("Build name").fill("Playwright Shield-Wall");
    await expect(page.getByText("Sign in to save it")).toBeVisible();
    await expect(page.getByText("Draft saved")).toBeVisible();

    // The draft survives a reload, on the same step.
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Name the build");
    await expect(page.getByLabel("Build name")).toHaveValue("Playwright Shield-Wall");
    await expect(page.getByRole("complementary", { name: "Setup steps" })).toContainText("2 of 2 chosen");

    // Signing in (as Discord would) and coming back finishes the build.
    await signIn(context);
    await page.goto("/new?step=name");
    await page.getByRole("button", { name: "Create build" }).click();
    await page.waitForURL(/\/b\/[23456789abcdefghjkmnpqrstuvwxyz]{10}\/edit/);
    await expect(page.getByRole("region", { name: "Edit bar" }).getByText("Playwright Shield-Wall")).toBeVisible();
    await expect(page.getByText("Level", { exact: true })).toBeVisible();

    // It is theirs, and a fresh /new starts clean.
    await page.goto("/me");
    await expect(page.getByRole("heading", { name: "Playwright Shield-Wall" })).toBeVisible();
    await expect(page.getByRole("article").filter({ hasText: "Playwright Shield-Wall" }).getByText("Link only")).toBeVisible();
    await page.goto("/new");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a race");
  });

  test("the Master of One skill select works inside its card without toggling it", async ({ page }) => {
    await page.goto("/new?step=traits");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose up to two traits");
    const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Master of One", exact: true }) });
    await card.getByRole("heading", { name: "Master of One", exact: true }).click();
    await expect(card.getByRole("button", { name: "Chosen" })).toBeVisible();
    await card.getByText("Which skill?").click();
    await card.getByRole("combobox").selectOption("Alchemy");
    await expect(card.getByRole("combobox")).toHaveValue("Alchemy");
    await expect(card.getByRole("button", { name: "Chosen" })).toHaveAttribute("aria-pressed", "true");
  });
});
