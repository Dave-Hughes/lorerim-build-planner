import { expect, test, type Page } from "@playwright/test";
import { head } from "@vercel/blob";
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

  test("images: upload, caption and alt text, shown on the build page, and deleted from the store when removed", async ({ page, context }) => {
    await signIn(context);
    const editor = await openGuide(page);
    await editor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    await page.keyboard.type("Riverwood at dusk.");
    await page.keyboard.press("Enter");
    await page.keyboard.type("/image");
    const chooser = page.waitForEvent("filechooser");
    await page.keyboard.press("Enter");
    await (await chooser).setFiles({ name: "riverwood.png", mimeType: "image/png", buffer: PNG });
    const img = editor.locator('img[src*=".public.blob.vercel-storage.com/dev/builds/"]');
    await expect(img).toHaveCount(1, { timeout: 20_000 });
    await page.getByRole("textbox", { name: "Alt text" }).fill("A wooden mill by a river");
    await page.getByRole("textbox", { name: "Caption" }).fill("The mill at Riverwood");
    await expect(page.getByRole("status")).toHaveText("Saved");
    const url = (await img.getAttribute("src"))!;

    await page.goto(`/b/${TEST_BUILD_ID}`);
    const figure = page.getByRole("region", { name: "Guide" }).locator("figure");
    await expect(figure.locator("img")).toHaveAttribute("alt", "A wooden mill by a river");
    await expect(figure.locator("img")).toHaveAttribute("loading", "lazy");
    await expect(figure.locator("figcaption")).toHaveText("The mill at Riverwood");

    // Taken out of the guide: deleted from the store on the next save.
    await openGuide(page);
    await page.getByRole("textbox", { name: "Guide" }).getByRole("button", { name: "Remove" }).click();
    await expect(page.getByRole("status")).toHaveText("Saved");
    await expect
      .poll(async () => head(url).then(() => "there", () => "gone"), { timeout: 15_000 })
      .toBe("gone");
  });

  test("a 5 MB image and an SVG are refused with a clear message", async ({ page, context }) => {
    await signIn(context);
    const editor = await openGuide(page);
    await editor.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024 - PNG.length)]);
    await page.getByLabel("Add images").setInputFiles({ name: "huge.png", mimeType: "image/png", buffer: big });
    await expect(page.getByRole("alert").filter({ hasText: "Too big: 5.0 MB. Images can be up to 4 MB." })).toBeVisible();
    await page.getByLabel("Add images").setInputFiles({ name: "map.svg", mimeType: "image/svg+xml", buffer: SVG });
    await expect(page.getByRole("alert").filter({ hasText: "Only PNG, JPEG, WebP or GIF images." })).toBeVisible();

    // The server refuses them too, whatever the browser says the file is.
    const svg = await page.request.post(`/api/builds/${TEST_BUILD_ID}/images`, { multipart: { file: { name: "map.png", mimeType: "image/png", buffer: SVG } } });
    expect(svg.status()).toBe(415);
    expect((await svg.json()).error).toBe("Only PNG, JPEG, WebP or GIF images.");
    const huge = await page.request.post(`/api/builds/${TEST_BUILD_ID}/images`, { multipart: { file: { name: "huge.png", mimeType: "image/png", buffer: big } } });
    expect(huge.status()).toBe(413);
    expect((await huge.json()).error).toBe("Too big: 5.0 MB. Images can be up to 4 MB.");
  });
});

/** A 4x3 PNG. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAAGElEQVR42mP4z8DwH4wZGBj+M2AFDAwMAPI0BP0ZpIb9AAAAAElFTkSuQmCC",
  "base64",
);
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>');
