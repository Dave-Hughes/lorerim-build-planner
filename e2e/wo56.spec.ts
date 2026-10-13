import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** The +N shown in a skill's stepper at this level. */
const raised = (page: Page, skill: string) => page.getByRole("button", { name: `Raise ${skill}` }).locator("..");

test("Repeat level 11 at level 12 copies its skills and attribute, and Undo puts level 12 back", async ({ page, context }) => {
  // Azrem's level 11: Stamina; Block, Evasion, One-Handed, Restoration +1, Marksman and Smithing +5.
  // Its level 12: Health; Smithing +4 and no Restoration.
  await signIn(context, "other");
  await page.goto(`/b/${AZREM_BUILD_ID}/edit?level=12`);
  const col = page.getByRole("region", { name: "Attribute and skills" });
  const attr = (name: string) => col.getByRole("group", { name: "Attribute" }).getByRole("button", { name: new RegExp(`^${name}`) });
  await expect(attr("Health")).toHaveAttribute("aria-pressed", "true");
  await expect(raised(page, "Smithing")).toContainText("+4");

  await col.getByRole("button", { name: "Repeat level 11" }).click();
  await expect(attr("Stamina")).toHaveAttribute("aria-pressed", "true");
  await expect(raised(page, "Smithing")).toContainText("+5");
  await expect(raised(page, "Restoration")).toContainText("+1");
  await expect(raised(page, "Marksman")).toContainText("+5");

  await col.getByRole("button", { name: "Undo" }).click();
  await expect(attr("Health")).toHaveAttribute("aria-pressed", "true");
  await expect(raised(page, "Smithing")).toContainText("+4");
  await expect(raised(page, "Restoration")).toContainText("0");
  await expect(col.getByRole("button", { name: "Repeat level 11" })).toBeVisible();
});
