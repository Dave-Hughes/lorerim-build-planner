import { expect, test, type Locator } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** The icon is decorative (alt="") and its name sits beside it. */
async function iconWithName(scope: Locator, file: string, name: string | RegExp) {
  const img = scope.locator(`img[src="/icons/${file}.svg"]`).first();
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute("alt", "");
  await expect(img.locator("xpath=..")).toContainText(name);
}

test("level markers in the card, the pinned bar and the editor", async ({ page, context }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  const card = page.getByRole("region", { name: "Level 6", exact: true });
  await iconWithName(card, "mark-trainer", "Trainer");
  await page.goto(`/b/${TEST_BUILD_ID}?level=6`);
  await iconWithName(page.getByRole("region", { name: "Level 6", exact: true }), "mark-banked", "Banked");
  await page.goto(`/b/${AZREM_BUILD_ID}?level=15`);
  await iconWithName(page.getByRole("region", { name: "Level 15", exact: true }), "mark-skill-book", /Skill books?/);

  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=4`);
  await iconWithName(page.getByRole("region", { name: "Level", exact: true }), "mark-perk-points", "Perk points");
  await iconWithName(page.getByRole("region", { name: "Also at this level" }), "mark-trainer", "Trainer session");
  await iconWithName(page.getByRole("region", { name: "Also at this level" }), "mark-skill-book", "Skill book");
});

test("gear slots in the editor, the card and Gear at level N", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
  const gear = page.getByRole("region", { name: "Gear" });
  await iconWithName(gear, "slot-main-hand", "Main hand");
  await iconWithName(gear, "slot-body", "Body");
  await page.goto(`/b/${TEST_BUILD_ID}?level=6`);
  // The seeded gear is free text, with no item behind it: the plain Other icon (WO-46).
  await iconWithName(page.getByRole("region", { name: "Level 6", exact: true }), "slot-other", "Steel plate armor");
  // The timeline's rows name their slots with the slot's icon (the cards went in WO-50).
  await iconWithName(page.getByRole("region", { name: "Gear at level 6" }), "slot-off-hand", "Off hand");
});

test("game modes in the about bar and Set up; tags in Set up, Browse and the build page", async ({ page, context }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}`);
  await iconWithName(page.getByRole("region", { name: "Character", exact: true }), "mode-konahrik", "Konahrik");

  await page.goto("/");
  await page.getByRole("button", { name: /^Tags/ }).click();
  const tags = page.getByRole("group", { name: "Tags" });
  await iconWithName(tags, "tag-shield", "Shield");
  await iconWithName(tags, "evasion", "Light Armor");
  await iconWithName(tags, "tag-beginner-friendly", "Beginner-friendly");

  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/setup?step=mode`);
  await iconWithName(page.getByRole("region", { name: "Game mode" }), "mode-naaktiid", "Naaktiid");
  await page.goto(`/b/${TEST_BUILD_ID}/setup?step=name`);
  await iconWithName(page.getByRole("group", { name: "Tags" }), "tag-necromancy", "Necromancy");
});
