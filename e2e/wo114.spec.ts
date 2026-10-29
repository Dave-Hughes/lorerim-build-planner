/**
 * WO-114: one character, two views. Start a run on a build alone moves its Story into the run; /me is
 * one grid; and create_playthrough with creation fields makes both through the door. New character's
 * question, the Build tab, "Part of a run" and the Tale page were replaced by WO-116 (wo116.spec.ts).
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { MENDER_BUILD_ID } from "./seed";

test.describe.configure({ mode: "serial" });

test("Start a run on a build alone's card: its Story becomes the run's first chapter", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: "The Mender", exact: true }) });
  await card.getByRole("link", { name: /^Plan a playthrough/ }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${MENDER_BUILD_ID}/run$`));
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${MENDER_BUILD_ID}\\?tab=playthrough$`));
  // WO-179: the run is the character's Playthrough tab; its id is in the Edit link.
  await page.getByRole("region", { name: "Build" }).getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page).toHaveURL(/\/p\/[a-z0-9]{10}\/edit\/play$/);
  const pid = new URL(page.url()).pathname.split("/")[2];

  // The Story is the run's first chapter, in the reader (WO-116).
  await page.goto(`/p/${pid}/tale`);
  const reader = page.getByRole("region", { name: /^Reading: / });
  await expect(reader.getByRole("heading", { level: 1, name: "The Mender" })).toBeVisible();
  await expect(reader.getByText("Every wound in Skyrim is somebody's business.")).toBeVisible();
  await expect(reader.getByText("She came north with a satchel of herbs")).toBeVisible();
  // The build's own page reads the run's tale from the beginning.
  await page.goto(`/b/${MENDER_BUILD_ID}`);
  await expect(page.getByRole("link", { name: /^Read the story/ }).first()).toHaveAttribute("href", new RegExp(`/b/${MENDER_BUILD_ID}/story/\\d+$`));
});

test("/me is one grid: characters with a run and builds alone", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  await expect(page.getByRole("heading", { level: 1, name: "My characters" })).toBeVisible();
  await expect(page.getByText(/\d+ characters: \d+ with a run, \d+ builds? alone/)).toBeVisible();
  const kyria = page.getByRole("article").filter({ has: page.getByRole("link", { name: "Kyria, Knight of Stendarr" }) });
  // The one character card (WO-164): its act line, with Edit and Delete under it.
  await expect(kyria.getByText(/^Act \d+ of \d+/)).toBeVisible();
  await expect(kyria.getByRole("link", { name: "Edit" })).toBeVisible();
  await expect(kyria.getByRole("button", { name: /^Delete/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "My playthroughs" })).toHaveCount(0);
});

test("through the door, create_playthrough with creation fields makes the build and the run", async ({ page, context, baseURL }) => {
  const from = ip();
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  const made = await call(baseURL!, from, t.access_token, "create_playthrough", { name: "E2E Door Kyria", line: "Made in one call.", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech", "One-Handed", "Alchemy", "Wayfarer"], start: "Regular (Inn)", startOption: "Random" });
  expect(made.isError, made.text).toBe(false);
  const r = made.json();
  expect(r).toMatchObject({ visibility: "private", act: { name: "The first days", levels: "1 to 5" } });
  expect(r.build).toMatch(/^[a-z0-9]{10}$/);
  const got = (await call(baseURL!, from, t.access_token, "get_playthrough", { playthrough: r.playthrough })).json();
  expect(got.build).toMatchObject({ id: r.build, name: "E2E Door Kyria", levels: 1 });
  expect(got.acts[0]).toMatchObject({ name: "The first days", levels: "1 to 5" });
  const builds = (await call(baseURL!, from, t.access_token, "list_my_builds", {})).json();
  expect(builds.find((b: { build: string }) => b.build === r.build).run).toMatchObject({ playthrough: r.playthrough });
});
