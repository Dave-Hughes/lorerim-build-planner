/**
 * WO-121a Part 5 (on WO-103): This was wrong on a quest line's page asks for sign-in first and comes back to the form;
 * a signed-in player sends up to 5 an hour; report_quest files one through the door; /admin shows each with where it
 * came from and who sent it.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

const from = ip();

test("signed out, This was wrong asks for Discord and comes back to the form", async ({ page }) => {
  await page.goto("/quests/wyrmstooth");
  await page.getByRole("button", { name: "This was wrong" }).click();
  await expect(page.getByText("Sign in with Discord to tell us. You'll come back here.")).toBeVisible();
  await expect(page.locator("#report").getByRole("button", { name: "Sign in with Discord" })).toBeVisible();
  await expect(page.locator("#report").locator("input[name=redirectTo]")).toHaveValue("/quests/wyrmstooth?report=1#report");
  // Where the sign-in comes back to: the form, open.
  await page.goto("/quests/wyrmstooth?report=1#report");
  await expect(page.getByText("Sign in with Discord to tell us.")).toBeVisible();
});

test("signed in, a report sends; the sixth in an hour is refused; /admin shows the source and the player", async ({ page, context, baseURL }) => {
  test.setTimeout(120_000);
  await signIn(context, "other");
  const send = async (n: number) => {
    // Its own address each time: the same one with a hash wouldn't load the page again.
    await page.goto(`/quests/wyrmstooth?report=1&n=${n}`);
    await page.getByRole("radio", { name: "Who and where" }).check();
    await page.getByLabel("What happened in your game?").fill(`E2E report ${n}: Theodyn Bienne was at the docks, not in Wyrmstooth.`);
    await page.getByRole("button", { name: "Send" }).click();
  };
  await send(1);
  await expect(page.locator("#report")).toHaveText("Thanks. We'll check it.");

  // Through the door, signed in with facts: what the planner said and what the player saw.
  const t = await tokenFor(page, context, baseURL!, from, "facts");
  const sent = await call(baseURL!, from, t.access_token, "report_quest", { quest: "Waking Nightmare", what: "How to start it", said: "Hear people in Dawnstar talk about it.", saw: "E2E: Erandur stopped me on the road first." });
  expect(sent.isError, sent.text).toBe(false);
  expect(sent.json()).toMatchObject({ sent: true, line: "waking-nightmare" });
  const unknown = await call(baseURL!, from, t.access_token, "report_quest", { quest: "No Such Quest", said: "x", saw: "y" });
  expect(unknown.text).toBe("No quest or quest line called No Such Quest. search_facts finds its id.");

  // Five in the hour now (four from the page, one through the door): the sixth is refused.
  for (let n = 2; n <= 4; n++) {
    await send(n);
    await expect(page.locator("#report")).toHaveText("Thanks. We'll check it.");
  }
  await send(5);
  await expect(page.locator("#report").getByRole("alert")).toHaveText("You've sent a few already. Try again later.");

  await context.clearCookies();
  await signIn(context);
  await page.goto("/admin");
  const reports = page.getByRole("list", { name: "Quest reports, newest first" });
  const door = reports.getByRole("listitem").filter({ hasText: "Erandur stopped me on the road first." });
  await expect(door).toContainText("Waking Nightmare");
  await expect(door).toContainText("Through E2E Claude");
  await expect(door).toContainText("Someone Else");
  await expect(door).toContainText("The planner said Hear people in Dawnstar talk about it.");
  const site = reports.getByRole("listitem").filter({ hasText: "E2E report 1:" });
  await expect(site).toContainText("On the quest page");
  await expect(site).toContainText("Someone Else");
  await expect(site).toContainText("Who and where");
  // The status sticks.
  await site.getByLabel("Status").selectOption("fixed");
  await page.waitForLoadState("networkidle");
  await page.reload();
  await expect(reports.getByRole("listitem").filter({ hasText: "E2E report 1:" }).getByLabel("Status")).toHaveValue("fixed");
});
