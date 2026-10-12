import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FORTY_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("Slow Time, 2 words, from Deepwood Redoubt at level 25: it saves and reloads", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FORTY_BUILD_ID}/edit?level=25`);
  const shouts = page.getByRole("region", { name: "Shouts", exact: true });
  await shouts.getByRole("button", { name: "Add shout" }).click();
  await shouts.getByRole("combobox", { name: "Shout" }).fill("slow ti");
  await shouts.getByRole("option", { name: /Slow Time/ }).click();
  await shouts.getByRole("radio", { name: "2 words" }).click();
  await shouts.getByLabel("Where (optional)").fill("Deepwood Redoubt");
  await shouts.getByRole("button", { name: "Add", exact: true }).click();
  await expect(shouts.getByRole("listitem")).toContainText("Slow Time");
  // The page opens "Saved"; wait for the change itself to save.
  await expect(page.getByText("Saved", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await page.reload();
  const after = page.getByRole("region", { name: "Shouts", exact: true });
  await expect(after.getByRole("listitem")).toHaveCount(1);
  await expect(after.getByRole("listitem")).toContainText("Slow Time");
  await expect(after.getByRole("radiogroup", { name: "Words of Slow Time" }).getByRole("radio", { name: "2 words" })).toHaveAttribute("aria-checked", "true");
  await expect(after.getByLabel("Where for Slow Time")).toHaveValue("Deepwood Redoubt");
  // The words' tooltip: the two known, with their meanings.
  await after.getByText("Slow Time", { exact: true }).focus();
  await expect(page.getByRole("tooltip")).toContainText("Tiid Klo: Time, Sand");
});
