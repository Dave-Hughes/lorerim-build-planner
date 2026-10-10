import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_BUILD_ID } from "./seed";

async function openGuide(page: Page) {
  await page.goto(`/b/${TEST_BUILD_ID}/edit`);
  await page.getByRole("link", { name: "Guide" }).click();
  await page.waitForURL(`**/b/${TEST_BUILD_ID}/guide`);
  const editor = page.getByRole("textbox", { name: "Guide" });
  await expect(editor).toBeVisible();
  return editor;
}

test.describe("the written guide", () => {
  test("an owner writes and formats it, it autosaves, and visitors see it", async ({ page, context }) => {
    await signIn(context);
    const editor = await openGuide(page);
    // The old plain-text notes are the starting text.
    await expect(editor).toContainText("Example build to show how the planner works.");

    await editor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await page.keyboard.type("## Where to go");
    await page.keyboard.press("Enter");
    await page.keyboard.type("- Riverwood");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Whiterun");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    // The "/" block menu: filter, then Enter.
    await page.keyboard.type("/tip");
    await expect(page.getByRole("listbox", { name: "Blocks" }).getByRole("option")).toHaveText(["Tip"]);
    await page.keyboard.press("Enter");
    await page.keyboard.type("Keep the shield up.");
    await expect(page.getByRole("status")).toHaveText("Saved");

    await page.reload();
    await expect(editor.getByRole("heading", { level: 2, name: "Where to go" })).toBeVisible();
    await expect(editor.locator("li")).toHaveText(["Riverwood", "Whiterun"]);
    await expect(editor.locator('[data-callout="tip"]')).toHaveText("Keep the shield up.");

    await page.goto(`/b/${TEST_BUILD_ID}`);
    const guide = page.getByRole("region", { name: "Guide" });
    await expect(guide.getByRole("heading", { level: 2, name: "Where to go" })).toBeVisible();
    await expect(guide.getByRole("listitem")).toHaveText(["Riverwood", "Whiterun"]);
    await expect(guide.getByRole("complementary")).toHaveText("TipKeep the shield up.");
    await expect(page.getByText("Notes from the author")).toHaveCount(0);
  });

  test("pasting from a styled page keeps the structure and drops the styling", async ({ page, context }) => {
    await signIn(context);
    const editor = await openGuide(page);
    await editor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await editor.evaluate((el) => {
      const html =
        '<h1 style="color:red;font-family:\'Comic Sans MS\'">Big Title</h1>' +
        '<p><span style="font-weight:700;color:#ff0000;font-size:30px">Bold red</span> and ' +
        '<a href="https://example.com" style="color:green">a link</a> and <a href="javascript:alert(1)">a bad one</a></p>' +
        "<table><tr><td>Cell text</td></tr></table>";
      const data = new DataTransfer();
      data.setData("text/html", html);
      data.setData("text/plain", "Big Title");
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
    });
    await expect(editor.getByRole("heading", { level: 2, name: "Big Title" })).toBeVisible();
    await expect(editor.locator("strong")).toHaveText("Bold red");
    await expect(editor.locator('a[href="https://example.com"]')).toHaveText("a link");
    await expect(editor.locator('a[href^="javascript"]')).toHaveCount(0);
    await expect(editor.locator("[style], font, table, span[style]")).toHaveCount(0);
    await expect(editor).toContainText("Cell text");
    await expect(page.getByRole("status")).toHaveText("Saved");
  });

  test("a javascript: link is refused", async ({ page, context }) => {
    await signIn(context);
    const editor = await openGuide(page);
    await editor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await page.keyboard.type("Visit here");
    await page.keyboard.press("Shift+Home");
    await page.getByRole("toolbar", { name: "Format" }).getByRole("button", { name: "Link" }).click();
    await page.getByRole("textbox", { name: "Link" }).fill("javascript:alert(1)");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("alert").filter({ hasText: "Links must start with http:// or https://" })).toBeVisible();
    await expect(editor.locator("a")).toHaveCount(0);
  });

  test("level notes: the old note opens in the editor, edits save, and show on the build page", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=2`);
    const notes = page.getByRole("textbox", { name: "Notes for level 2" });
    // The level's old plain-text note is the starting text.
    await expect(notes).toHaveText("Wolves and bandits on the roads around Falkreath.");
    await notes.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("Cleared **Embershard Mine** for the ore.");
    const box = page.getByRole("region", { name: "Notes for level 2" });
    await expect(box.getByRole("status")).toHaveText("Saved");

    await page.reload();
    await expect(notes.locator("strong")).toHaveText("Embershard Mine");
    await expect(notes).toHaveText("Cleared Embershard Mine for the ore.");

    await page.goto(`/b/${TEST_BUILD_ID}?level=2`);
    await expect(page.getByRole("region", { name: "Notes for level 2" })).toHaveText("Cleared Embershard Mine for the ore.");
    await expect(page.getByRole("region", { name: "Notes for level 2" }).locator("strong")).toHaveText("Embershard Mine");
    await expect(page.getByRole("button", { name: /^Level 2, notes/ })).toBeVisible();
    await expect(page.getByText("Notes", { exact: true })).toBeVisible();
  });
});
