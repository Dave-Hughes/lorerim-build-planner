/**
 * WO-96 with FEATURE_COMING_SOON on (the "soon" project's server): an admin's invite lets one player
 * past the coming soon page, once; Remove in /admin puts the page back.
 */
import { expect, test, type Browser, type Page } from "@playwright/test";
import { signIn } from "./helpers";

test.use({ viewport: { width: 1440, height: 900 } });
// One invite, followed from making it to taking the access away.
test.describe.configure({ mode: "serial" });

async function isComingSoon(page: Page) {
  await expect(page.getByText("Opening soon", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "How this started" })).toBeVisible();
}
async function isApp(page: Page) {
  // The app's own header (the site's, or /new's focused one), and no coming soon page.
  await expect(page.getByRole("banner").getByRole("link", { name: "LoreRim Build Planner" })).toBeVisible();
  await expect(page.getByText("Opening soon")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "How this started" })).toHaveCount(0);
}
async function as(browser: Browser, who: "author" | "other" | null) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  if (who) await signIn(context, who);
  return { context, page: await context.newPage() };
}

let link = "";

test("an admin makes an invite; signed out, its link shows the scene and Sign in with Discord", async ({ browser }) => {
  const admin = await as(browser, "author");
  await admin.page.goto("/admin");
  const section = admin.page.getByRole("region", { name: "Early access" });
  await section.getByLabel("Name").fill("Zenematics");
  await section.getByRole("button", { name: "Make invite" }).click();
  const made = section.getByRole("status");
  await expect(made).toContainText("It works once, for 14 days.");
  await expect(made.getByRole("button", { name: "Copy link" })).toBeVisible();
  link = new URL((await made.locator("code").textContent())!).pathname;
  expect(link).toMatch(/^\/invite\/[A-Za-z0-9_-]{43}$/);
  await expect(section.getByRole("list", { name: "Invites" }).getByText("Waiting")).toBeVisible();
  await admin.context.close();

  const out = await as(browser, null);
  const res = await out.page.goto(link);
  expect(res?.status()).toBe(200);
  await expect(out.page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/LoreRim\s*Build Planner/);
  await expect(out.page.getByText("Zenematics, you're invited in early.")).toBeVisible();
  await expect(out.page.getByRole("button", { name: "Sign in with Discord" })).toBeVisible();
  await expect(out.page.getByRole("button", { name: "Come in" })).toHaveCount(0);
  await out.context.close();
});

test("signed in, Come in lands on the app, and the app stays open on later pages", async ({ browser }) => {
  const zen = await as(browser, "other");
  // Before: the coming soon page.
  await zen.page.goto("/");
  await isComingSoon(zen.page);
  await zen.page.goto(link);
  await zen.page.getByRole("button", { name: "Come in" }).click();
  await zen.page.waitForURL((u) => u.pathname === "/");
  await isApp(zen.page);
  await expect(zen.page.getByRole("heading", { name: "Builds" })).toBeVisible();
  for (const path of ["/new", "/me", "/"]) {
    await zen.page.goto(path);
    await isApp(zen.page);
  }
  await zen.context.close();
});

test("a second account can't use the same link", async ({ browser }) => {
  const second = await as(browser, "author");
  await second.page.goto(link);
  await expect(second.page.getByText("This invite has been used or has run out. Ask Tapps for a new one.")).toBeVisible();
  await expect(second.page.getByRole("button", { name: "Come in" })).toHaveCount(0);
  await expect(second.page.getByRole("button", { name: "Sign in with Discord" })).toHaveCount(0);
  // The list says who used it.
  await second.page.goto("/admin");
  await expect(second.page.getByRole("list", { name: "Invites" }).getByText("Used by Someone Else")).toBeVisible();
  await second.context.close();
});

test("Remove in /admin puts the coming soon page back", async ({ browser }) => {
  const admin = await as(browser, "author");
  await admin.page.goto("/admin");
  const people = admin.page.getByRole("list", { name: "People with early access" });
  const row = people.getByRole("listitem").filter({ hasText: "Someone Else" });
  await row.getByRole("button", { name: "Remove" }).click();
  await expect(row).toHaveCount(0);
  await admin.context.close();

  const zen = await as(browser, "other");
  await zen.page.goto("/");
  await isComingSoon(zen.page);
  await zen.context.close();
});
