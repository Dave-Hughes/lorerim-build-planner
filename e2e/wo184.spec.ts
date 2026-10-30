/**
 * WO-184: players make it right. Two players and an admin: a screenshot goes up under review, is hidden from the other player, is approved by the admin and
 * seen by both; the admin trusts the first player, whose next one is live at once; "This screenshot isn't this place" puts one back on the list; "I know this" on a
 * person page is read, approved, and shown as a player's report; Help fill the gaps lists the page until then; Recently confirmed shows a confirmation; and
 * every board's screen is photographed at 1440 and 390.
 */
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import sharp from "sharp";
import { REPORTER_TOKENS } from "./seed";
import { signIn } from "./helpers";

test.describe.configure({ mode: "serial" });

const PLACE = "/places/bleak-falls-barrow";
const as = async (context: BrowserContext, token: string) => {
  await context.clearCookies();
  await context.addCookies([{ name: "authjs.session-token", value: token, domain: "localhost", path: "/" }]);
};
const png = (colour: string, w = 1280, h = 720) => sharp({ create: { width: w, height: h, channels: 3, background: colour } }).png().toBuffer();

async function upload(page: Page, colour: string, opts: { w?: number; h?: number; name?: string } = {}) {
  await page.getByRole("button", { name: "+ Add a screenshot" }).first().click();
  const dialog = page.getByRole("dialog", { name: /Add a screenshot of/ });
  await dialog.getByLabel("Screenshot file").setInputFiles({ name: opts.name ?? "shot.png", mimeType: "image/png", buffer: await png(colour, opts.w, opts.h) });
  await dialog.getByLabel(/This is my own screenshot/).check();
  await dialog.getByRole("button", { name: "Add the screenshot" }).click();
  await expect(dialog).toBeHidden();
}

const shot = async (page: Page, name: string, full = true) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${name} at ${width} scrolls sideways`).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo184-${name}-${width}.png`, fullPage: full });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
};

test("a place with no screenshot says so, signed out it asks to sign in, and a bad file or an unticked box is refused", async ({ page, context }) => {
  await page.goto(PLACE);
  await expect(page.getByText("No screenshot of Bleak Falls Barrow yet")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in to add a screenshot" }).first()).toBeVisible();
  await shot(page, "pic-place-empty");
  await as(context, REPORTER_TOKENS[0]);
  await page.goto(PLACE);
  await page.getByRole("button", { name: "+ Add a screenshot" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Add a screenshot of Bleak Falls Barrow" });
  await dialog.getByLabel("Screenshot file").setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("not a screenshot") });
  await expect(dialog.getByRole("alert")).toContainText("PNG or JPG");
  await dialog.getByLabel("Screenshot file").setInputFiles({ name: "shot.png", mimeType: "image/png", buffer: await png("#3a5a40") });
  await expect(dialog.getByRole("button", { name: "Add the screenshot" })).toBeDisabled();
  await shot(page, "pic-add");
});

test("a player's screenshot waits under review: they see it, flagged; another player does not", async ({ page, context }) => {
  await as(context, REPORTER_TOKENS[0]);
  await page.goto(PLACE);
  await upload(page, "#3a5a40");
  await expect(page.getByText("Under review").first()).toBeVisible();
  await expect(page.getByText("Only you can see it until an admin approves it")).toBeVisible();
  await expect(page.getByRole("button", { name: "Remove it" })).toBeVisible();
  await shot(page, "pic-yours");
  // The first player's /me says what happened to it.
  await page.goto("/me");
  await expect(page.getByRole("region", { name: "What you sent" })).toContainText("Waiting on an admin");
  // A second player sees nothing.
  await as(context, REPORTER_TOKENS[1]);
  await page.goto(PLACE);
  await expect(page.getByText("No screenshot of Bleak Falls Barrow yet")).toBeVisible();
  await expect(page.getByText("Under review")).toHaveCount(0);
});

test("the admin approves it, and trusts the player; both players then see it, and the player's next one is live at once", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/admin");
  await expect(page.getByRole("link", { name: "The review list" })).toBeVisible();
  await page.goto("/admin/review?tab=shots");
  await expect(page.getByRole("link", { name: "Screenshots 1" })).toBeVisible();
  const card = page.getByRole("article", { name: "Screenshot for Bleak Falls Barrow" });
  await expect(card).toContainText("Reporter 1");
  await expect(card).toContainText("The check only looks for nudity");
  await shot(page, "admin-review-screenshots");
  await card.getByRole("button", { name: "Approve, and trust this player" }).click();
  await expect(page.getByText("Nothing waiting.")).toBeVisible();
  await page.goto("/admin/review?tab=trust");
  await expect(page.getByText("Reporter 1")).toBeVisible();
  await expect(page.getByText("Admin", { exact: true })).toBeVisible();
  await shot(page, "admin-review-players");
  // Both players see the live one, credited.
  for (const token of [REPORTER_TOKENS[0], REPORTER_TOKENS[1]]) {
    await as(context, token);
    await page.goto(PLACE);
    await expect(page.getByText("Screenshot by Reporter 1")).toBeVisible();
    await expect(page.getByText("1 of 1")).toBeVisible();
    await expect(page.getByText("Under review")).toHaveCount(0);
  }
  // Their next one is live at once, and a screenshot that is not 16:9 is letterboxed in black, never cropped.
  await as(context, REPORTER_TOKENS[0]);
  await page.goto(PLACE);
  await upload(page, "#8a4a42", { w: 800, h: 800, name: "square.png" });
  await expect(page.getByText("Under review")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Screenshot 2/ })).toBeVisible();
  await page.getByRole("button", { name: /Screenshot 2/ }).click();
  await expect(page.getByText("2 of 2")).toBeVisible();
  const fit = await page.locator("figure img").first().evaluate((el) => getComputedStyle(el).objectFit);
  expect(fit).toBe("contain");
  await shot(page, "pic-place");
});

test("the admin on a place: Make this lead, and Delete asks first", async ({ page, context }) => {
  await signIn(context);
  await page.goto(PLACE);
  await expect(page.getByText("Leads the page")).toBeVisible();
  await page.getByRole("button", { name: /Screenshot 2/ }).click();
  await page.getByRole("button", { name: "Make this lead" }).click();
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("1 of 2")).toBeVisible();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("alertdialog", { name: "Delete this screenshot?" })).toContainText("It goes from the page for everyone");
  await shot(page, "pic-admin");
  await page.getByRole("button", { name: "Keep it" }).click();
  await expect(page.getByRole("alertdialog")).toBeHidden();
});

test("\"This screenshot isn't this place\" puts it back on the review list with the report", async ({ page, context }) => {
  await as(context, REPORTER_TOKENS[1]);
  await page.goto(PLACE);
  await page.getByRole("button", { name: "Report a mistake" }).click();
  const dialog = page.getByRole("dialog", { name: "Report a mistake" });
  await dialog.getByLabel("This screenshot isn't this place").check();
  await dialog.getByRole("radio", { name: /Screenshot 1/ }).check();
  await dialog.getByLabel(/What is it a screenshot of/).fill("It looks like the Pelagia Farm.");
  await dialog.getByRole("button", { name: "Send it" }).click();
  await expect(dialog).toContainText("Sent. Thanks.");
  await signIn(context);
  await page.goto("/admin/review?tab=shots");
  const card = page.getByRole("article", { name: "Screenshot for Bleak Falls Barrow" });
  await expect(card).toContainText("A player said it isn't this place: It looks like the Pelagia Farm.");
  await card.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(page.getByText("Nothing waiting.")).toBeVisible();
});

test("I know this on a person page: read, approved, shown as a player's report; Help fill the gaps lists the page until then", async ({ page, context }) => {
  await page.goto("/help-fill-the-gaps?kind=person");
  // The first person whose name starts with a letter (a person the records call "???" sorts first, and is no good to look for by name).
  const { name, href, gap } = await page.evaluate(() => {
    for (const li of document.querySelectorAll("main li")) {
      const a = li.querySelector("a");
      const chip = li.querySelector("span span");
      if (a && chip && /^[A-Za-z]/.test(a.textContent ?? "")) return { name: (a.textContent ?? "").trim(), href: a.getAttribute("href") ?? "", gap: (chip.textContent ?? "").replace(/^\? /, "").trim() };
    }
    return { name: "", href: "", gap: "" };
  });
  expect(href).toMatch(/^\/people\//);
  // Signed out: the line asks to sign in.
  await page.goto(href);
  await expect(page.getByRole("button", { name: "Sign in to tell us" }).first()).toBeVisible();
  // Signed in: the form opens under the line.
  await as(context, REPORTER_TOKENS[1]);
  // (A hash alone would not reload the page, and the signed-out one is still on screen.)
  await page.goto("/");
  await page.goto(`${href}#know-0`);
  const form = page.getByRole("group", { name: new RegExp(`What you know about ${gap.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") });
  await expect(form).toBeVisible();
  await expect(form).toContainText("An admin reads it before it shows on the page. It's credited to your Discord name.");
  await shot(page, "confirm-know");
  await form.getByLabel("What do you know?").fill("He stands by the forge from the morning bell until supper, then goes home.");
  await form.getByRole("radio", { name: "I saw it in my game" }).check();
  await form.getByRole("button", { name: "Send it" }).click();
  await expect(page.getByText("Sent. Thanks.")).toBeVisible();
  await shot(page, "confirm-sent");
  await page.goto("/me");
  await expect(page.getByRole("region", { name: "What you sent" })).toContainText(name);
  // Still listed, until it is approved.
  await page.goto("/help-fill-the-gaps?kind=person&n=2000");
  await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  await shot(page, "help-gaps", false);
  // The admin reads it and approves it.
  await signIn(context);
  await page.goto("/admin/review");
  // (Other specs leave quest reports waiting, so the count is not 1.)
  await expect(page.getByRole("link", { name: /What players know/ })).toContainText(/\d/);
  const card = page.getByRole("article", { name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:`) });
  await expect(card).toContainText("He stands by the forge");
  await expect(card).toContainText("Saw it in their game");
  await expect(card).toContainText("The agent hasn't read this yet.");
  await shot(page, "admin-review-facts");
  await card.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(page.getByText("Nothing waiting.")).toBeVisible();
  // The page shows it as a player's report, not the game files; the gap is gone from the list.
  await page.goto(href);
  await expect(page.getByText("A player's report, not the game files: He stands by the forge")).toBeVisible();
  await page.goto("/help-fill-the-gaps?kind=person&n=2000");
  const row = page.getByRole("listitem").filter({ has: page.getByRole("link", { name, exact: true }) });
  await expect(row.getByText(`? ${gap}`, { exact: true })).toHaveCount(0);
});

test("Report a mistake on a person: waits on the admin, who can fix it or say it isn't one", async ({ page, context }) => {
  await as(context, REPORTER_TOKENS[1]);
  await page.goto("/people/mjoll-the-lioness");
  await page.getByRole("button", { name: "Report a mistake" }).click();
  const dialog = page.getByRole("dialog", { name: "Report a mistake" });
  await dialog.getByLabel("What is wrong?").fill("Mjoll is in Riften, not Windhelm.");
  await dialog.getByRole("button", { name: "Send it" }).click();
  await expect(dialog).toContainText("Sent. Thanks.");
  await signIn(context);
  await page.goto("/admin/review");
  const card = page.getByRole("article", { name: /Mjoll the Lioness: a mistake/ });
  await expect(card).toContainText("Mjoll is in Riften, not Windhelm.");
  await expect(card.getByRole("button", { name: "Fix it" })).toBeVisible();
  await expect(card.getByRole("button", { name: "Send to Jeff" })).toBeVisible();
  await card.getByRole("button", { name: "Not a mistake" }).click();
  await expect(page.getByText("Nothing waiting.")).toBeVisible();
});

test("confirming a page: the Players line says so with Undo, and Recently confirmed on the home page shows it", async ({ page, context }) => {
  await as(context, REPORTER_TOKENS[2]);
  await page.goto("/places/broken-oar-grotto");
  await page.getByRole("button", { name: "Confirm it's accurate" }).click();
  await page.getByRole("dialog", { name: "Confirmed" }).getByRole("button", { name: "Close" }).click();
  await page.reload();
  const ic = page.getByRole("region", { name: "Information Confidence" });
  await expect(ic).toContainText(/You confirmed this on \d+ \w+\./);
  await expect(ic.getByText("Confirmed", { exact: true })).toBeVisible();
  await expect(ic.getByRole("button", { name: "Undo" })).toBeVisible();
  await page.goto("/");
  const section = page.getByRole("region", { name: "Recently confirmed by players" });
  await expect(section).toContainText("Broken Oar Grotto");
  await expect(section).toContainText("Confirmed by Reporter 3");
  await expect(section.getByRole("link", { name: "Help fill the gaps ›" })).toHaveAttribute("href", "/help-fill-the-gaps");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: `test-results/wo184-home-confirmed-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  // Undo takes it back, and the card goes (nothing else is confirmed, so the section isn't drawn).
  await page.goto("/places/broken-oar-grotto");
  await ic.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("button", { name: "Confirm it's accurate" })).toBeVisible();
});

test("page views are counted with no cookie or account, and a robot is not counted", async ({ request, page }) => {
  const key = "mjoll-the-lioness";
  const human = { "user-agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/130 Safari/537.36" };
  const looked = async () => {
    await page.goto("/help-fill-the-gaps?kind=person&n=2000");
    const row = page.getByRole("listitem").filter({ has: page.getByRole("link", { name: "Mjoll the Lioness", exact: true }) });
    const m = /([\d,]+) looked this week/.exec(await row.innerText());
    return m ? Number(m[1].replace(/,/g, "")) : 0;
  };
  const before = await looked();
  const res = await request.post("/api/views", { data: { kind: "person", key }, headers: human });
  expect(res.status()).toBe(204);
  expect(res.headers()["set-cookie"]).toBeUndefined();
  await request.post("/api/views", { data: { kind: "person", key }, headers: { "user-agent": "Googlebot/2.1" } });
  expect((await request.post("/api/views", { data: { kind: "person", key: "no-such-person" }, headers: human })).status()).toBe(204);
  expect(await looked()).toBe(before + 1);
});

test("the sixth board: Help fill the gaps filters and shows more; nothing a player reads about screenshots says picture or image", async ({ page }) => {
  await page.goto("/help-fill-the-gaps");
  await expect(page.getByRole("heading", { level: 1, name: "Help fill the gaps" })).toBeVisible();
  const filters = page.getByRole("navigation", { name: "Filter" });
  for (const label of ["All", "Quests", "People", "Places"]) await expect(filters.getByRole("link", { name: new RegExp(`^${label} [\\d,]+$`) })).toBeVisible();
  expect(await page.getByRole("listitem").filter({ has: page.getByRole("link", { name: "I know this ›" }) }).count()).toBe(50);
  await page.getByRole("link", { name: "Show more ›" }).click();
  await expect(page.getByRole("listitem").filter({ has: page.getByRole("link", { name: "I know this ›" }) })).toHaveCount(100);
  await filters.getByRole("link", { name: /^Places/ }).click();
  await expect(page).toHaveURL(/kind=place/);
  await shot(page, "help-gaps-places", false);
  // The World menu links to it, and a Not sure yet box links to it.
  await page.goto("/places/broken-oar-grotto");
  await expect(page.getByRole("link", { name: "See everything we're unsure of ›" })).toHaveAttribute("href", "/help-fill-the-gaps");
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/\b(picture|image)s?\b/i);
});

test("a person with no screenshot: the spot beside the title, 16:9", async ({ page }) => {
  await page.goto("/people/mjoll-the-lioness");
  await expect(page.getByText("No screenshot of Mjoll the Lioness yet")).toBeVisible();
  const box = await page.getByText("No screenshot of Mjoll the Lioness yet").locator("..").boundingBox();
  expect(box!.width / box!.height).toBeGreaterThan(1.7);
  expect(box!.width / box!.height).toBeLessThan(1.8);
  await shot(page, "pic-person");
});
