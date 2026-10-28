import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { LINK_ONLY_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("the header's nav is Characters, World (Quests, People, Places, Gear) and Guide (WO-157); New character is a button (WO-114); the avatar menu works by keyboard", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const header = page.getByRole("banner");
  await expect(header.getByRole("navigation", { name: "Site" }).getByRole("link")).toHaveText(["Characters", "Guide"]);
  await header.getByRole("button", { name: "World" }).click();
  await expect(header.getByRole("link", { name: /^Quests/ })).toBeVisible();
  for (const w of ["People", "Places", "Gear"]) await expect(header.getByRole("link", { name: new RegExp(`^${w}`) })).toBeVisible();
  await expect(header.getByRole("link", { name: "New character" })).toHaveClass(/btn-primary/);

  const account = header.getByRole("button", { name: /account menu/ });
  await expect(account).toHaveAttribute("aria-haspopup", "menu");
  await account.focus();
  await page.keyboard.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Account" });
  await expect(menu.getByRole("menuitem", { name: "My page" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  const myBuilds = menu.getByRole("menuitem", { name: "My characters" });
  await expect(myBuilds).toBeFocused();
  await expect(myBuilds).toHaveAttribute("aria-current", "page");
  // The test author is an admin (WO-40): the review list comes next.
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: /^Review/ })).toBeFocused();
  // Show me around (WO-61) comes before Sign out.
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Show me around" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("menuitem", { name: "Sign out" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(account).toBeFocused();

  // A click outside closes it; My page goes to the player's page.
  await account.click();
  await expect(menu).toBeVisible();
  await page.mouse.click(5, 600);
  await expect(menu).toHaveCount(0);
  await account.click();
  await menu.getByRole("menuitem", { name: "My page" }).click();
  await expect(page).toHaveURL(/\/u\/e2e-test-author$/);
});

test("signed out, the header offers Sign in and New character", async ({ page }) => {
  await page.goto("/characters");
  const header = page.getByRole("banner");
  await expect(header.getByRole("button", { name: /Sign in/ })).toBeVisible();
  await expect(header.getByRole("link", { name: "New character" })).toBeVisible();
});

test("a player's Liked shows only the Listed builds they liked", async ({ page, context }) => {
  await signIn(context, "other");
  for (const id of [TEST_BUILD_ID, LINK_ONLY_BUILD_ID]) {
    await page.goto(`/b/${id}`);
    await page.getByRole("button", { name: /^Like/ }).click();
    await expect(page.getByRole("button", { name: /^Liked/ })).toHaveAttribute("aria-busy", "false");
  }
  await page.goto("/u/e2e-someone-else");
  await expect(page.getByText(/\d+ characters? \| 1 liked/)).toBeVisible();
  await page.getByRole("tab", { name: /^Liked/ }).click();
  const liked = page.getByRole("tabpanel");
  await expect(liked.getByRole("article")).toHaveCount(1);
  await expect(liked.getByRole("article")).toContainText("Test Shield-Wall");
  // The card is the home card (WO-161): it has no liked date.
  await expect(liked).not.toContainText("Link-Only Shield-Wall");

  // Unlike, so the other tests' like counts stay as seeded.
  for (const id of [TEST_BUILD_ID, LINK_ONLY_BUILD_ID]) {
    await page.goto(`/b/${id}`);
    await page.getByRole("button", { name: /^Liked/ }).click();
    await expect(page.getByRole("button", { name: /^Like/ })).toHaveAttribute("aria-busy", "false");
  }
});

test("a player with no likes says so", async ({ page }) => {
  await page.goto("/u/e2e-test-author?tab=liked");
  await expect(page.getByRole("tab", { name: /^Liked/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("No liked characters yet.");
});
