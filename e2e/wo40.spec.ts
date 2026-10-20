import { expect, test, type BrowserContext } from "@playwright/test";
import { signIn } from "./helpers";
import { AT_LIMIT_TOKEN, IRIEL_BUILD_ID, NEW_ACCOUNT_BUILD_ID, NEW_ACCOUNT_TOKEN, REPORTER_TOKENS, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

async function signInAs(context: BrowserContext, token: string) {
  await context.clearCookies();
  await context.addCookies([{ name: "authjs.session-token", value: token, domain: "localhost", path: "/" }]);
}

test("three players report a build: its cover hides; an admin keeps it and the cover is back", async ({ page, context }) => {
  const hero = page.getByRole("region", { name: "Build" });
  const cover = hero.locator('[style*="background-image"]');
  for (const token of REPORTER_TOKENS) {
    await signInAs(context, token);
    await page.goto(`/b/${IRIEL_BUILD_ID}`);
    await expect(cover).toHaveCount(1);
    await page.getByRole("button", { name: "Report", exact: true }).click();
    await page.getByRole("radio", { name: "Sexual content" }).check();
    await page.getByLabel("Anything to add (optional)").fill("e2e report");
    await page.getByRole("button", { name: "Send report" }).click();
    await expect(page.getByText("Thanks. An admin will look.")).toBeVisible();
  }
  await context.clearCookies();
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(hero.getByText("This image is waiting for a look.")).toBeVisible();
  await expect(cover).toHaveCount(0);

  // Only admins see the review list.
  await signIn(context, "other");
  expect((await page.goto("/admin/review"))?.status()).toBe(404);

  await signInAs(context, "e2e-session-token-0001");
  await page.goto("/");
  await expect(page.getByRole("button", { name: /account menu/ }).getByLabel(/to review/)).toBeVisible();
  await page.goto("/admin/review");
  const item = page.getByRole("listitem", { name: /^Reports on Iriel/ });
  await expect(item).toContainText("3 reports");
  await expect(item).toContainText("Sexual content");
  await item.getByRole("button", { name: "Keep" }).click();
  await expect(item).toHaveCount(0);

  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(cover).toHaveCount(1);
  await expect(hero.getByText("This image is waiting for a look.")).toHaveCount(0);
});

test("the 11th build in a day is refused; an account 2 days old can't set Listed", async ({ page, context }) => {
  await signInAs(context, AT_LIMIT_TOKEN);
  await page.goto(`/b/${TEST_BUILD_ID}`);
  await page.getByRole("button", { name: "Copy to my builds" }).click();
  await expect(page.getByText("That's a lot for one day. Try again tomorrow.")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}$`));

  await signInAs(context, NEW_ACCOUNT_TOKEN);
  await page.goto(`/b/${NEW_ACCOUNT_BUILD_ID}`);
  // The owner's controls are in the hero (WO-116a).
  const bar = page.getByRole("region", { name: "Build" });
  await bar.getByRole("button", { name: "Who can see it: Link only" }).click();
  await page.getByRole("menuitemradio", { name: /^Listed/ }).click();
  await expect(bar.getByText(/Your Discord account is new\. You can list builds and upload images from \d{1,2} \w{3} \d{4}\./)).toBeVisible();
  await expect(bar.getByRole("button", { name: "Who can see it: Link only" })).toBeVisible();
});
