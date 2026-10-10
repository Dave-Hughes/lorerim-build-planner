import { describe, expect, it } from "vitest";
import { guideDocSchema, isGuideKey, isSafeHref, notesToDoc, textLength, tooLongMessage } from "./doc";

const doc = (...content: unknown[]) => ({ type: "doc", content });
const p = (...content: unknown[]) => ({ type: "paragraph", content });
const t = (text: string, marks?: unknown[]) => ({ type: "text", text, ...(marks ? { marks } : {}) });

describe("guide document", () => {
  it("accepts the guide's own nodes and marks", () => {
    const d = doc(
      { type: "heading", attrs: { level: 2 }, content: [t("Where to go")] },
      p(t("Bold", [{ type: "bold" }]), t(" and "), t("a link", [{ type: "link", attrs: { href: "https://example.com", target: "_blank" } }])),
      { type: "bulletList", content: [{ type: "listItem", content: [p(t("Riverwood"))] }] },
      { type: "tip", content: [p(t("Take the shield."))] },
      { type: "youtube", attrs: { src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", start: 0, width: 640 } },
    );
    const r = guideDocSchema.safeParse(d);
    expect(r.success).toBe(true);
    // Unknown attributes are dropped, not stored.
    expect(JSON.stringify(r.data)).not.toContain("_blank");
  });

  it("refuses a javascript: link", () => {
    const r = guideDocSchema.safeParse(doc(p(t("x", [{ type: "link", attrs: { href: "javascript:alert(1)" } }]))));
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe("Links must start with http:// or https://");
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("data:text/html,x")).toBe(false);
    expect(isSafeHref("https://discord.com/channels/1")).toBe(true);
  });

  it("refuses node types the guide doesn't have, and HTML", () => {
    expect(guideDocSchema.safeParse(doc({ type: "table", content: [] })).success).toBe(false);
    expect(guideDocSchema.safeParse(doc({ type: "heading", attrs: { level: 1 }, content: [t("H1")] })).success).toBe(false);
    expect(guideDocSchema.safeParse("<p>hi</p>").success).toBe(false);
    expect(guideDocSchema.safeParse(doc({ type: "youtube", attrs: { src: "https://evil.example/embed/x" } })).success).toBe(false);
  });

  it("counts text and words the limit message", () => {
    expect(textLength(doc(p(t("abc")), p(t("de"))) as never)).toBe(5);
    expect(tooLongMessage(61_200, 60_000)).toBe("Too long to save: 61,200 of 60,000 characters");
  });

  it("turns old plain-text notes into paragraphs", () => {
    expect(notesToDoc("First line\nsecond\n\nNext para")).toEqual({
      type: "doc",
      content: [
        { type: "paragraph", content: [t("First line"), { type: "hardBreak" }, t("second")] },
        { type: "paragraph", content: [t("Next para")] },
      ],
    });
  });

  it("knows its section keys", () => {
    expect(["overview", "level:1", "level:100"].every(isGuideKey)).toBe(true);
    expect(["level:0", "level:101", "notes", "level:x"].some(isGuideKey)).toBe(false);
  });
});
