/**
 * WO-146: players fill the gaps. A signed-in player sends where Running Wild's note is; an admin has the agent propose (a stub
 * model, never the real API), approves it, and the quest page and get_quest show it as a player's report, not the game files,
 * with the player and the date; the player's /me says so. Nothing reaches a page before the approval.
 */
import { createServer, type Server } from "node:http";
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { REPORTER_TOKENS } from "./seed";

test.describe.configure({ mode: "serial" });

const NOTE = "Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun";
const PLACE = "E2E: the board right outside Joslin's house, behind the Bannered Mare";
const prompts: string[] = [];
let stub: Server;

test.beforeAll(async () => {
  // The model, as Propose calls it: one answer, the same whatever is asked, and what it was asked kept to check.
  stub = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      prompts.push(body);
      // A second player's report that says what the page now says: the agent agrees, and proposes the same way (Part 1b).
      const agrees = body.includes("E2E AGREES");
      const proposal = agrees
        ? {
            words: `Already on the page: ${NOTE}, on the board by Joslin's house`,
            replaces: null,
            way: { how: `${NOTE}, on the board by Joslin's house`, whereIs: ["Whiterun, the board right outside Joslin's house"] },
            fits: "agrees",
            why: "The report says what a player's report already on the page says.",
            confidence: "high",
          }
        : {
        words: `Way in: ${NOTE}, on the board by Joslin's house`,
        replaces: NOTE,
        way: { how: `${NOTE}, on the board by Joslin's house`, whereIs: ["Whiterun, the board right outside Joslin's house"] },
        fits: "adds a place",
        why: "The records have the note placed near Joslin's House; the report names the board outside it.",
        confidence: "high",
      };
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ model: "e2e-stub", content: [{ type: "text", text: JSON.stringify(proposal) }], usage: { input_tokens: 100, output_tokens: 50 } }));
    });
  });
  await new Promise<void>((ok) => stub.listen(3399, "127.0.0.1", ok));
});
test.afterAll(() => new Promise<void>((done) => stub.close(() => done())));

test("a signed-in player sends where it is, and nothing changes on the page", async ({ page, context }) => {
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[0], domain: "localhost", path: "/" }]);
  await page.goto("/quests/capital-whiterun?report=1#report");
  await page.getByLabel("I know where this is").check();
  await page.getByLabel("Which quest?").selectOption({ label: "Running Wild" });
  await page.getByLabel("Where is it?").fill(PLACE);
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.locator("#report")).toHaveText("Thanks. We'll check it.");
  // Not on the page yet: the way is still the files' and Dave's.
  await page.goto("/quests/capital-whiterun");
  await expect(page.getByText("E2E: the board right outside")).toHaveCount(0);
});

test("an admin has the agent propose, approves it, and the page shows a player's report", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/admin");
  const reports = page.getByRole("list", { name: "Quest reports, newest first" });
  const mine = reports.locator(":scope > li").filter({ hasText: PLACE });
  await expect(mine).toContainText("Where it is");
  await expect(mine).toContainText("Running Wild");
  await expect(mine.getByLabel("On the page now")).toContainText(NOTE);
  await mine.getByRole("button", { name: "Propose" }).click();
  await expect(mine).toContainText("adds a place, high confidence");
  await expect(mine).toContainText(`Way in: ${NOTE}, on the board by Joslin's house`);
  // The agent was given the report and the quest's records, and asked for nothing else.
  expect(prompts).toHaveLength(1);
  expect(prompts[0]).toContain("E2E: the board right outside Joslin's house");
  expect(prompts[0]).toContain("Running Wild");
  expect(prompts[0]).toContain("Never add a place, a person or a step from memory");
  await page.screenshot({ path: "test-results/wo146-admin-proposal-1440.png", fullPage: true });
  // Still nothing on the page.
  const pageNow = await page.request.get("/quests/capital-whiterun");
  expect(await pageNow.text()).not.toContain("on the board by Joslin");
  await mine.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(mine).toContainText("Approved");
  await page.goto("/quests/capital-whiterun");
  // Under the quest's How it starts, closed until opened: marked as a player's report, with who and when.
  const row = page.locator('[id="q-0WRHorseQ"]');
  await row.getByRole("button", { name: "Journal ›" }).click();
  await row.getByText("How it starts", { exact: true }).click();
  await expect(row.getByText(`${NOTE}, on the board by Joslin's house`)).toBeVisible();
  await expect(row.getByText(/player report, @e2e-reporter-1, \d{1,2} \w{3} \d{4}/)).toBeVisible();
  await expect(row.getByText("(Whiterun, the board right outside Joslin's house)")).toBeVisible();
  await row.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/wo146-quest-page-1440.png" });
});

test("get_quest says it is a player's report, with the player and the date; /me thanks them", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  // The door looks again at the facts every ten seconds, so it has the approval within that.
  const ask = async () => (await call(baseURL!, from, token, "get_quest", { name: "Running Wild", level: 5 })).json();
  await expect.poll(async () => (await ask()).quest.start.ways[0].way, { timeout: 25_000, intervals: [1000] }).toBe(`${NOTE}, on the board by Joslin's house`);
  const got = await ask();
  const way = got.quest.start.ways[0];
  expect(way.checked).toMatch(/^a player's report, not the game files \(@e2e-reporter-1, \d{1,2} \w{3} \d{4}\)$/);
  expect(way.whereIs).toEqual(["Whiterun, the board right outside Joslin's house"]);
  expect(got.openForYou.state).toBe("open");

  await context.clearCookies();
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[0], domain: "localhost", path: "/" }]);
  await page.goto("/me");
  await expect(page.getByText("Your report on Running Wild is on the planner now. Thank you.")).toBeVisible();
  await page.screenshot({ path: "test-results/wo146-me-1440.png" });
});

test("a second player agreeing is closed as no change, and the page then has two sources", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[2], domain: "localhost", path: "/" }]);
  await page.goto("/quests/capital-whiterun?report=1#report");
  await page.getByLabel("I know where this is").check();
  await page.getByLabel("Which quest?").selectOption({ label: "Running Wild" });
  await page.getByLabel("Where is it?").fill("E2E AGREES: the board by Joslin's house");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.locator("#report")).toHaveText("Thanks. We'll check it.");

  await context.clearCookies();
  await signIn(context);
  await page.goto("/admin");
  const mine = page.getByRole("list", { name: "Quest reports, newest first" }).locator(":scope > li").filter({ hasText: "E2E AGREES" });
  await mine.getByRole("button", { name: "Propose" }).click();
  await expect(mine).toContainText("Already on the page. Nothing to change.");
  // Nothing to approve: one button to close it, and Edit and Not a problem for the admin who wants them.
  await expect(mine.getByRole("button", { name: "Approve", exact: true })).toHaveCount(0);
  await expect(mine).not.toContainText("Replaces");
  await expect(mine.getByRole("button", { name: "Edit and approve" })).toBeVisible();
  await expect(mine.getByRole("button", { name: "Not a problem" })).toBeVisible();
  await page.screenshot({ path: "test-results/wo146-admin-nochange-1440.png", fullPage: true });
  await mine.getByRole("button", { name: "Close: already on the page" }).click();
  await expect(mine).toContainText("No change,");

  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const ask = async () => (await call(baseURL!, from, token, "get_quest", { name: "Running Wild", level: 5 })).json();
  await expect.poll(async () => (await ask()).quest.start.ways[0].checked, { timeout: 25_000, intervals: [1000] }).toMatch(/^players' reports, not the game files \(2\): @e2e-reporter-1, \d{1,2} \w{3}; @e2e-reporter-3, \d{1,2} \w{3}$/);
  await page.goto("/quests/capital-whiterun");
  const row = page.locator('[id="q-0WRHorseQ"]');
  await row.getByRole("button", { name: "Journal ›" }).click();
  await row.getByText("How it starts", { exact: true }).click();
  await expect(row.getByText(/players' reports \(2\): @e2e-reporter-1, \d{1,2} \w{3}; @e2e-reporter-3, \d{1,2} \w{3}/)).toBeVisible();
  await row.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/wo146-quest-two-sources-1440.png" });
  // The way itself is as it was: still one way.
  expect((await ask()).quest.start.ways).toHaveLength(1);
});

test("a how report names who and where, and Not a problem closes one without a fact", async ({ page, context, baseURL }) => {
  const from = ip();
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[1], domain: "localhost", path: "/" }]);
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  // A line, not a quest: refused, naming what's missing.
  const noQuest = await go("report_quest", { quest: "capital-whiterun", kind: "how", who: "Joslin" });
  expect(noQuest.isError).toBe(true);
  expect(noQuest.text).toContain("Say which quest of the line you mean.");
  const noFields = await go("report_quest", { quest: "Running Wild", kind: "how" });
  expect(noFields.isError).toBe(true);
  expect(noFields.text).toContain("Say who starts it, where, or what you did.");
  const sent = await go("report_quest", { quest: "Running Wild", kind: "how", who: "E2E Joslin", where: "Bannered Mare", how: "I read the board and took the quest" });
  expect(sent.isError, sent.text).toBe(false);

  await context.clearCookies();
  await signIn(context);
  await page.goto("/admin");
  const mine = page.getByRole("list", { name: "Quest reports, newest first" }).locator(":scope > li").filter({ hasText: "E2E Joslin" });
  await expect(mine.getByLabel("What they said")).toContainText("Bannered Mare");
  await mine.getByRole("button", { name: "Not a problem" }).click();
  await expect(mine).toContainText("Not a problem,");
  // No fact was written: Running Wild still has the one way, the approved one from before.
  const got = (await call(baseURL!, from, (await tokenFor(page, context, baseURL!, from)).access_token, "get_quest", { name: "Running Wild", level: 5 })).json();
  expect(got.quest.start.ways).toHaveLength(1);
  expect(got.quest.start.ways[0].checked).toMatch(/^(a player's report|players' reports)/);
});
