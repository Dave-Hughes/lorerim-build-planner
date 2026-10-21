/**
 * WO-112 Part 2: Read a save on Play's edit tab. The reader runs in the browser on a save built byte for
 * byte in the test; the page shows what it found and how many of the run's quest objectives it would tick,
 * and a save of someone else is said plainly and asks before it's used. Use this isn't pressed here: it
 * would replace Kyria's seeded Save 7, which other specs read.
 */
import { expect, test } from "@playwright/test";
import { buildSave } from "../src/lib/save/fixture";
import { signIn } from "./helpers";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const EDIT = `/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`;
const CAUGHT_RED_HANDED = 0x041f91; // FreeformRiften11 in Skyrim.esm

function file(name: string, saveNumber: number) {
  return { name: `Save${saveNumber}.ess`, mimeType: "application/octet-stream", buffer: Buffer.from(buildSave({ name, saveNumber, quests: [{ form: CAUGHT_RED_HANDED, stages: [[10, 1], [12, 1]] }] })) };
}

test("Read a save shows what it found, in the browser, and Cancel leaves where you stand alone", async ({ page, context }) => {
  await signIn(context);
  await page.goto(EDIT);
  const stand = page.getByRole("region", { name: "Where you stand" });
  await expect(stand.getByRole("button", { name: "Read a save" })).toBeVisible();
  await expect(stand.getByRole("button", { name: "Enter it by hand" })).toBeVisible();
  const before = await stand.textContent();
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.postData()?.slice(0, 64) ?? "");
  });
  await page.getByLabel("A save file (.ess)").setInputFiles(file("Kyria Severa", 62));
  const found = page.getByRole("region", { name: "What the save says" });
  await expect(found).toContainText("Kyria Severa, level 10, day 15, The Rift. Save 62.");
  await expect(found).toContainText("It would tick 1 of this run's 2 quest objectives.");
  await expect(found.getByRole("alert")).toHaveCount(0);
  expect(posts.some((p) => p.startsWith("TESV_SAVEGAME"))).toBe(false); // the save never leaves the page
  await found.getByRole("button", { name: "Cancel" }).click();
  await expect(found).toHaveCount(0);
  await expect(stand).toHaveText(before ?? "");
});

test("a save of someone else says so, and Use this asks first", async ({ page, context }) => {
  await signIn(context);
  await page.goto(EDIT);
  await page.getByLabel("A save file (.ess)").setInputFiles(file("Azrem Shieldbreaker", 243));
  const found = page.getByRole("region", { name: "What the save says" });
  await expect(found.getByRole("alert")).toHaveText("This save is Azrem Shieldbreaker, not Kyria Severa.");
  await found.getByRole("button", { name: "Use this" }).click();
  await expect(found).toContainText("Use Azrem Shieldbreaker’s save for Kyria Severa?");
  await expect(found.getByRole("button", { name: "Use it" })).toBeVisible();
  await found.getByRole("button", { name: "Cancel" }).click();
  await expect(found).toHaveCount(0);
});

test("a file that isn't a save is said plainly", async ({ page, context }) => {
  await signIn(context);
  await page.goto(EDIT);
  await page.getByLabel("A save file (.ess)").setInputFiles({ name: "notes.ess", mimeType: "application/octet-stream", buffer: Buffer.from("not a save") });
  await expect(page.getByRole("region", { name: "What the save says" }).getByRole("alert")).toHaveText("This isn't a Skyrim save (.ess).");
});
