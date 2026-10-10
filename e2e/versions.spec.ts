import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { OLD_BUILD_ID, OLD_VERSION, RETIRED_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.describe("LoreRim versions", () => {
  test("creation says which version it is for on every step, and Change opens the list", async ({ page }) => {
    await page.goto("/new?step=race");
    const band = page.getByRole("region", { name: "LoreRim version" });
    await expect(band).toContainText("Building for LoreRim 5.0.4.8");
    await expect(band).toContainText("Latest");
    await expect(page.getByRole("complementary", { name: "Setup steps" })).toContainText("LoreRim 5.0.4.8");
    await band.getByRole("button", { name: "Change" }).click();
    const list = band.getByRole("list", { name: "LoreRim versions" });
    await expect(list.getByRole("listitem")).toHaveCount(1);
    await expect(list.getByRole("listitem").first()).toContainText("LoreRim 5.0.4.8");
    await expect(list.getByRole("listitem").first()).toContainText("Chosen");

    await page.goto("/new?step=name");
    await expect(page.getByRole("region", { name: "LoreRim version" })).toContainText("Building for LoreRim 5.0.4.8");
    await expect(page.getByRole("main")).toContainText("LoreRim 5.0.4.8");
  });

  test("the setup page shows the band too, and offers a copy rather than a change", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/setup`);
    const band = page.getByRole("region", { name: "LoreRim version" });
    await expect(band).toContainText("Building for LoreRim 5.0.4.8");
    await band.getByRole("button", { name: "Change" }).click();
    await expect(band.getByRole("listitem").first()).toContainText("This build");
  });

  test("an old-version build says so and can be copied for the current version", async ({ page, context }) => {
    await page.goto(`/b/${OLD_BUILD_ID}`);
    const notice = page.getByRole("region", { name: "LoreRim version" });
    await expect(notice).toContainText(`Made for LoreRim ${OLD_VERSION}. The current version is 5.0.4.8.`);
    await expect(notice.getByRole("button")).toHaveCount(0);
    await expect(page.getByText("Witcher")).toBeVisible();

    await signIn(context);
    await page.reload();
    await page.getByRole("button", { name: "Copy for 5.0.4.8" }).click();
    await page.waitForURL(/\/b\/[23456789abcdefghjkmnpqrstuvwxyz]{10}\/edit\?/);
    await expect(page.getByRole("region", { name: "Copied from an older version" })).toHaveText(
      `Copied from LoreRim ${OLD_VERSION} to 5.0.4.8. Everything carried over.`,
    );

    // The original is untouched.
    await page.goto(`/b/${OLD_BUILD_ID}`);
    await expect(page.getByRole("region", { name: "LoreRim version" })).toContainText(`Made for LoreRim ${OLD_VERSION}.`);
  });

  test("Browse shows the current version by default, and every version on request", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("LoreRim version")).toHaveValue("5.0.4.8");
    await expect(page.getByRole("heading", { name: "Old Version Shield-Wall" })).toHaveCount(0);
    await page.getByLabel("LoreRim version").selectOption("all");
    await expect(page.getByRole("heading", { name: "Old Version Shield-Wall" })).toBeVisible();
  });

  test("a build for a version no longer in the planner still opens, without numbers", async ({ page }) => {
    await page.goto(`/b/${RETIRED_BUILD_ID}`);
    await expect(page.getByText("LoreRim 4.0.0-retired is no longer in the planner.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Retired Version Build" })).toBeVisible();
    await expect(page.getByText("Attributes")).toHaveCount(0);
  });
});
