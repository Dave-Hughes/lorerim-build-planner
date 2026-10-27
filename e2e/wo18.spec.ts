import { expect, test } from "@playwright/test";
import { signIn, savedInBand } from "./helpers";
import { LONG_BUILD_ID, SCRATCH_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.describe("tags", () => {
  test("a build tagged Necromancy and Heavy Armor is found by both, not by Necromancy and Marksman", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${LONG_BUILD_ID}/setup?step=name`);
    // Suggested from the majors (Heavy Armor, Block, One-Handed), shown chosen, the label's "i" saying so (WO-118).
    await expect(page.getByRole("button", { name: "Remove Heavy Armor" })).toBeVisible();
    await page.getByRole("button", { name: "About tags" }).hover();
    await expect(page.getByRole("tooltip")).toContainText("suggested from your majors");
    await page.getByRole("button", { name: "+ Add a tag" }).click();
    const tags = page.getByRole("group", { name: "Tags" });
    await expect(tags.getByRole("button", { name: "Heavy Armor" })).toHaveAttribute("aria-pressed", "true");
    await expect(tags.getByRole("button", { name: "Shield" })).toHaveAttribute("aria-pressed", "true");
    await tags.getByRole("button", { name: "Shield" }).click();
    await tags.getByRole("button", { name: "One-Handed" }).click();
    await tags.getByRole("button", { name: "Necromancy" }).click();
    await page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ }).click();
    await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: /^Listed/ }).click();
    // Every change saves as it is made (WO-117).
    await savedInBand(page);

    // The shared page shows them, each linking to Browse filtered by it.
    await page.goto(`/b/${LONG_BUILD_ID}`);
    const line = page.getByRole("list", { name: "Tags" });
    await expect(line.getByRole("link")).toHaveText(["Heavy Armor", "Necromancy"]);

    await page.goto("/?tags=necromancy,heavy-armor");
    await expect(page.getByRole("heading", { name: "Long Shield-Wall" })).toBeVisible();
    await page.goto("/?tags=necromancy,marksman");
    await expect(page.getByRole("heading", { name: "Long Shield-Wall" })).toHaveCount(0);
    await expect(page.getByText(/^No (builds|characters) match\.$/)).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByRole("heading", { name: "Long Shield-Wall" })).toBeVisible();

    // The same through the Tags control.
    await page.getByRole("button", { name: /^Tags/ }).click();
    await page.getByRole("group", { name: "Tags" }).getByRole("button", { name: "Necromancy" }).click();
    await expect(page).toHaveURL(/tags=necromancy/);
    await expect(page.getByRole("heading", { name: "Long Shield-Wall" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Test Shield-Wall" })).toHaveCount(0);
  });
});

// The Long build is listed by the tags test above (this file runs in order).
test("search finds a build by part of its description, and the address keeps it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("main").getByLabel("Search").fill("twenty lev");
  await expect(page).toHaveURL(/q=twenty\+lev|q=twenty%20lev/);
  await expect(page.getByRole("heading", { name: "Long Shield-Wall" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Test Shield-Wall" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("main").getByLabel("Search")).toHaveValue("twenty lev");
  await expect(page.getByRole("heading", { name: "Long Shield-Wall" })).toBeVisible();
});

test.describe("likes", () => {
  test("like, reload, unlike", async ({ page, context }) => {
    await signIn(context, "other");
    await page.goto(`/b/${TEST_BUILD_ID}`);
    const like = page.getByRole("button", { name: /^Like/ });
    await expect(like).toHaveText(/Like\s*0/);
    await like.click();
    // The count changes at once; wait for the save before reloading.
    await expect(page.getByRole("button", { name: /^Liked/ })).toHaveText(/Liked\s*1/);
    await expect(page.getByRole("button", { name: /^Liked/ })).toHaveAttribute("aria-busy", "false");
    await page.reload();
    const liked = page.getByRole("button", { name: /^Liked/ });
    await expect(liked).toHaveAttribute("aria-pressed", "true");
    await expect(liked).toHaveText(/Liked\s*1/);
    await liked.click();
    await expect(page.getByRole("button", { name: /^Like/ })).toHaveText(/Like\s*0/);
    await expect(page.getByRole("button", { name: /^Like/ })).toHaveAttribute("aria-busy", "false");
    await page.reload();
    await expect(page.getByRole("button", { name: /^Like/ })).toHaveText(/Like\s*0/);
  });

  test("the owner can like their own build", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}`);
    await page.getByRole("button", { name: /^Like/ }).click();
    await expect(page.getByRole("button", { name: /^Liked/ })).toHaveText(/Liked\s*1/);
    await expect(page.getByRole("button", { name: /^Liked/ })).toHaveAttribute("aria-busy", "false");
    await page.reload();
    await page.getByRole("button", { name: /^Liked/ }).click();
    await expect(page.getByRole("button", { name: /^Like\b/ })).toHaveAttribute("aria-busy", "false");
    await expect(page.getByRole("button", { name: /^Like/ })).toHaveText(/Like\s*0/);
  });

  test("on a private build the owner can like it too (WO-118)", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SCRATCH_BUILD_ID}`);
    await page.getByRole("button", { name: /^Like/ }).click();
    await expect(page.getByRole("button", { name: /^Liked/ })).toHaveAttribute("aria-busy", "false");
    await page.getByRole("button", { name: /^Liked/ }).click();
    await expect(page.getByRole("button", { name: /^Like\b/ })).toHaveAttribute("aria-busy", "false");
  });

  test("a signed-out click goes to sign-in", async ({ page }) => {
    await page.goto(`/b/${TEST_BUILD_ID}`);
    const toDiscord = page.waitForRequest((r) => /discord\.com\/.*oauth2\/authorize|\/api\/auth\/signin/.test(r.url()), { timeout: 15_000 });
    await page.getByRole("button", { name: /^Like/ }).click();
    const req = await toDiscord;
    expect(req.url()).toMatch(/discord\.com|\/api\/auth\/signin/);
  });
});
