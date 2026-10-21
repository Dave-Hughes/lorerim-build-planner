/**
 * WO-124 Part 4: changing tab in edit never drops the frame. The Story tab linked to an address that redirected, and a
 * redirect during a tab change made Next load the whole document again: 0.8 s of an empty frame. Each tab change here
 * is sampled every 10 ms; the edit tabs are on screen in every sample.
 */
import { expect, test } from "@playwright/test";
import { KYRIA_BUILD_ID } from "./seed";
import { signIn } from "./helpers";

test("changing tab in edit never drops the edit tabs, and says how long each took", async ({ page, context }) => {
  test.setTimeout(120_000);
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/edit`);
  const tabs = page.getByRole("navigation", { name: "Edit tabs" });
  await tabs.waitFor();
  const times: string[] = [];
  for (const name of ["Story", "Set up", "Guide", "Story", "Play", "Story", "Levels"]) {
    await page.evaluate(() => {
      const w = window as unknown as { gaps: number[]; t0: number; on: boolean };
      w.gaps = [];
      w.t0 = performance.now();
      w.on = true;
      const tick = () => {
        if (!document.querySelector('nav[aria-label="Edit tabs"]')) w.gaps.push(Math.round(performance.now() - w.t0));
        if (w.on) setTimeout(tick, 10);
      };
      tick();
    });
    const t0 = Date.now();
    await tabs.getByRole("link", { name: new RegExp(`^${name}`) }).click();
    await expect(tabs.locator('[aria-current="page"]')).toContainText(name);
    const ms = Date.now() - t0;
    const gaps = await page.evaluate(() => {
      const w = window as unknown as { gaps: number[]; on: boolean };
      w.on = false;
      return w.gaps;
    });
    times.push(`${name}: ${ms} ms`);
    expect(gaps, `${name}: the edit tabs were gone at ${gaps.slice(0, 5).join(", ")} ms`).toEqual([]);
  }
  console.log(`WO-124 tab times: ${times.join(", ")}`);
});
