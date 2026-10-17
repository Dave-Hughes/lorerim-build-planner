/**
 * WO-96: the Early access section is for admins only.
 */
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test("a player who isn't an admin sees no Early access section", async ({ page, context }) => {
  await signIn(context, "other");
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Early access" })).toHaveCount(0);
});

test("an admin makes an invite with Tapps's own line for the person, and its page says it", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/admin");
  const section = page.getByRole("region", { name: "Early access" });
  await expect(section.getByText("People with early access")).toBeVisible();
  await section.getByLabel("Name").fill("E2E Custom");
  await section.getByLabel("What Tapps says").fill("A line written just for this test.");
  await section.getByRole("button", { name: "Make invite" }).click();
  const link = new URL((await section.getByRole("status").locator("code").textContent())!).pathname;
  await page.goto(link);
  await expect(page.getByText("A line written just for this test.")).toBeVisible();
  await expect(page.getByText("you're invited in early")).toHaveCount(0);
  // Take it back, so it doesn't sit in the list.
  await page.goto("/admin");
  const row = page.getByRole("list", { name: "Invites" }).getByRole("listitem").filter({ hasText: "E2E Custom" });
  await row.getByRole("button", { name: "Cancel" }).click();
  await expect(row).toHaveCount(0);
});
