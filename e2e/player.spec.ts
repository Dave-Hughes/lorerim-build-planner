import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_BUILD_ID, TEST_USER_HANDLE, TEST_USER_NAME } from "./seed";

test.describe("a player's page", () => {
  test("shows a visitor the listed builds and nothing else", async ({ page }) => {
    await page.goto(`/u/${TEST_USER_HANDLE}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(TEST_USER_NAME);
    await expect(page.getByText("1 build", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Test Shield-Wall" })).toBeVisible();
    // Link-only and private builds never show, not even to the owner.
    await expect(page.getByText("Link-Only Shield-Wall")).toHaveCount(0);
    await expect(page.getByText("Scratch Shield-Wall")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Copy link" })).toHaveCount(0);
    await expect(page).toHaveTitle(/Builds by Test Author/);
    // No email anywhere: not in the page, its props or its metadata.
    const html = await page.content();
    expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
    expect(html).not.toMatch(/\\?"email\\?"/);
  });

  test("the owner sees the same builds, plus Copy link", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/u/${TEST_USER_HANDLE}`);
    await expect(page.getByRole("heading", { name: "Test Shield-Wall" })).toBeVisible();
    await expect(page.getByText("Link-Only Shield-Wall")).toHaveCount(0);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy link" })).toBeVisible({ timeout: 4000 });
  });

  test("an unknown handle is a 404", async ({ page }) => {
    const res = await page.goto("/u/nobody-here");
    expect(res?.status()).toBe(404);
  });

  test("author names lead to the author's page, from a card and from a build", async ({ page }) => {
    await page.goto("/?version=all");
    await page.getByRole("article").filter({ hasText: "Test Shield-Wall" }).getByRole("link", { name: TEST_USER_NAME }).click();
    await expect(page).toHaveURL(new RegExp(`/u/${TEST_USER_HANDLE}$`));
    await page.goto(`/b/${TEST_BUILD_ID}`);
    await page.getByRole("region", { name: "Build" }).getByRole("link", { name: TEST_USER_NAME }).click();
    await expect(page).toHaveURL(new RegExp(`/u/${TEST_USER_HANDLE}$`));
  });

  test("My builds links to My page", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/me");
    await page.getByRole("link", { name: "My page" }).click();
    await expect(page).toHaveURL(new RegExp(`/u/${TEST_USER_HANDLE}$`));
  });
});
