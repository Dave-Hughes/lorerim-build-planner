import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_BUILD_ID } from "./seed";

test.describe("an author's builds", () => {
  test("copies the example build, lists it, and deletes it", async ({ page, context }) => {
    await signIn(context);
    await page.goto("/b/sample");
    await page.getByRole("button", { name: "Copy to my builds" }).click();
    await page.waitForURL(/\/b\/[23456789abcdefghjkmnpqrstuvwxyz]{10}\/edit/);
    await expect(page.getByRole("region", { name: "Edit bar" }).getByText("Falkreath Shield-Wall")).toBeVisible();

    await page.goto("/me");
    const card = page.getByRole("article").filter({ hasText: "Falkreath Shield-Wall" });
    await expect(card).toContainText("Only you");
    await card.getByRole("button", { name: "Delete Falkreath Shield-Wall" }).click();
    await card.getByRole("button", { name: "Confirm: delete Falkreath Shield-Wall" }).click();
    await expect(page.getByRole("article").filter({ hasText: "Falkreath Shield-Wall" })).toHaveCount(0);
  });

  test("changes the setup of an existing build", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/setup?step=name`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Details");
    await page.getByLabel("Description").fill("Now with a new description.");
    await page.getByLabel("Listed on Browse builds").check();
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.waitForURL(new RegExp(`/b/${TEST_BUILD_ID}/edit`));
    await page.goto(`/b/${TEST_BUILD_ID}`);
    await expect(page.getByText("Now with a new description.")).toBeVisible();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Test Shield-Wall" })).toBeVisible();
  });
});
