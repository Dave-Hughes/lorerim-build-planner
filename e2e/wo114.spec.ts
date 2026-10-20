/**
 * WO-114: one character, two views. New character with a run lands on the Play view; a build alone is
 * unchanged; Add a run on a build alone moves its Story into the run; the Build tab is the build with
 * "You are here"; the build's own page says it belongs to a run, to the owner and not to another player
 * while the run is private; the Tale is a reading page with Contents in a drawer; /me is one grid; and
 * create_playthrough with creation fields makes both through the door.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID, MENDER_BUILD_ID } from "./seed";
import sample from "../src/lib/rules/__fixtures__/sample-build.json";

test.describe.configure({ mode: "serial" });

// As the second seeded player: the test author's seeded builds already fill the site's 10 a day.
test("New character with a run: Set up, then The run, then the Play view with Act I", async ({ page, context }) => {
  await signIn(context, "other");
  const { name: _n, description: _d, ...plan } = sample as unknown as { name: string; description: string };
  void _n;
  void _d;
  // Set up's choices as a draft in this browser, as if the player had just walked through them.
  const draft = { plan, details: { name: "E2E Severa", description: "A knight of Stendarr hiding as a bard.", coverImageUrl: "", writeupUrl: "", visibility: "private", tags: null }, step: "name" };
  await context.addInitScript((d) => localStorage.setItem("lorerim-build-planner-draft-v1", d), JSON.stringify(draft));

  await page.goto("/new");
  await expect(page.getByRole("heading", { name: "What are you making?" })).toBeVisible();
  await page.getByRole("radio", { name: /A build and a run/ }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.getByRole("button", { name: "Next: The run" }).click();
  await expect(page.getByRole("heading", { name: "The run" })).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("E2E Severa");
  await expect(page.getByLabel("Act I")).toHaveValue("The first days");
  await page.getByLabel("New objective").fill("Take a room at the Bee and Barb");
  await page.getByRole("button", { name: "Add an objective" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();

  await expect(page).toHaveURL(/\/p\/[a-z0-9]{10}$/);
  await expect(page.getByRole("heading", { level: 1, name: "E2E Severa" })).toBeVisible();
  await expect(page.getByText("Act I The first days").first()).toBeVisible();
  await expect(page.getByText("Take a room at the Bee and Barb").first()).toBeVisible();
  // The build was made with it, and the Build tab is that build.
  await page.getByRole("navigation", { name: "Views" }).getByRole("link", { name: /^Build/ }).click();
  await expect(page.getByText("The build on its own: Only you")).toBeVisible();
});

test("a build alone is Set up as before", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/new");
  await page.getByRole("radio", { name: /A build alone/ }).click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page.getByRole("navigation", { name: "Setup steps" }).or(page.getByLabel("Setup steps"))).toBeVisible();
  await expect(page.getByText("The run", { exact: true })).toHaveCount(0);
});

test("Add a run on a build alone's card: its Story becomes the run's first chapter", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: "The Mender", exact: true }) });
  await expect(card.getByText("Build alone")).toBeVisible();
  await card.getByRole("link", { name: "Add a run ›" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${MENDER_BUILD_ID}/run$`));
  await page.getByRole("button", { name: "Confirm" }).click();
  await expect(page).toHaveURL(/\/p\/[a-z0-9]{10}$/);
  const pid = new URL(page.url()).pathname.split("/")[2];

  await page.goto(`/p/${pid}/tale`);
  await expect(page.getByRole("heading", { level: 1, name: "The Mender" })).toBeVisible();
  await expect(page.getByText("Every wound in Skyrim is somebody's business.")).toBeVisible();
  await expect(page.getByText("She came north with a satchel of herbs")).toBeVisible();
  // The build's own Story tab now points at the run's tale.
  await page.goto(`/b/${MENDER_BUILD_ID}?tab=story`);
  await expect(page.getByRole("link", { name: "The tale is in the run ›" })).toBeVisible();
});

test("the Build tab is the build, with You are here at the run's level", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/build`);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria Severa" })).toBeVisible();
  await expect(page.getByText("You are here")).toBeVisible();
  await expect(page.getByRole("tab", { name: /Levels/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy the build's link" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit the build" })).toHaveAttribute("href", `/b/${KYRIA_BUILD_ID}/edit`);
});

test("the build's own page names its run to the owner, and hides a private run from another player", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(page.getByText("Part of a run:")).toBeVisible();
  await expect(page.getByRole("link", { name: /Kyria Severa, Act I/ })).toHaveAttribute("href", `/p/${KYRIA_PLAYTHROUGH_ID}`);
  await context.clearCookies();
  await signIn(context, "other");
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
  await expect(page.getByText("Part of a run:")).toHaveCount(0);
});

test("the Tale is a reading page: no site header, and Contents opens and closes", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/tale`);
  await expect(page.getByRole("banner").getByRole("navigation", { name: "Site" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria Severa" })).toBeVisible();
  await page.getByRole("button", { name: "Contents" }).click();
  const drawer = page.getByRole("navigation", { name: "Contents" });
  await expect(drawer.getByRole("link", { name: "Chapter One: The Chapel by the Sea" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await page.getByRole("button", { name: "Contents" }).click();
  await page.mouse.click(1000, 400);
  await expect(drawer).toHaveCount(0);
});

test("/me is one grid: characters with a run and builds alone", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  await expect(page.getByRole("heading", { level: 1, name: "My characters" })).toBeVisible();
  await expect(page.getByText(/\d+ characters: \d+ with a run, \d+ builds? alone/)).toBeVisible();
  const kyria = page.getByRole("article").filter({ has: page.getByRole("link", { name: "Kyria, Knight of Stendarr" }) });
  await expect(kyria.getByText("Where the run stands")).toBeVisible();
  await expect(kyria.getByRole("link", { name: "Play ›" })).toHaveAttribute("href", `/p/${KYRIA_PLAYTHROUGH_ID}`);
  await expect(page.getByRole("heading", { name: "My playthroughs" })).toHaveCount(0);
});

test("through the door, create_playthrough with creation fields makes the build and the run", async ({ page, context, baseURL }) => {
  const from = ip();
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  const made = await call(baseURL!, from, t.access_token, "create_playthrough", { name: "E2E Door Kyria", line: "Made in one call.", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech"] });
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
