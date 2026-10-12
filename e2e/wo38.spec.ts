import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** Opens with `button`, checks `panel` shows; a click outside closes it; reopen, Esc closes it and focus is back on the button. */
async function closesOutsideAndOnEsc(page: Page, button: Locator, panel: Locator) {
  await button.click();
  await expect(panel).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.mouse.click(5, 880);
  await expect(panel).toBeHidden();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();
}

test("the account menu, the Tags filter and Other trees close outside and on Esc", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/");
  await closesOutsideAndOnEsc(page, page.getByRole("button", { name: /account menu/ }), page.getByRole("menu", { name: "Account" }));
  await closesOutsideAndOnEsc(page, page.getByRole("button", { name: /^Tags/ }), page.getByRole("group", { name: "Tags" }));

  await page.goto(`/b/${IRIEL_BUILD_ID}?level=22`);
  const others = page.getByRole("button", { name: /Other trees/ });
  await others.scrollIntoViewIfNeeded();
  await closesOutsideAndOnEsc(page, others, page.getByRole("menu", { name: "Other trees" }));
});

test("the footer: who made it, the community, and the fan-made line; no About page", async ({ page }) => {
  for (const url of ["/", `/b/${IRIEL_BUILD_ID}`, "/u/e2e-someone-else"]) {
    await page.goto(url);
    const foot = page.getByRole("contentinfo");
    await expect(foot).toContainText("Made by Tapps");
    await expect(foot.getByRole("link", { name: "LoreRim (Modding Bungalo) Community" })).toHaveAttribute("href", "https://discord.gg/bungalo");
    await expect(foot).toContainText("Fan-made. Not affiliated with Bethesda or the LoreRim team.");
    await expect(foot.getByText("Tip", { exact: true })).toHaveCount(0);
    await expect(foot.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
  }
  expect((await page.goto("/about"))?.status()).toBe(404);
});
