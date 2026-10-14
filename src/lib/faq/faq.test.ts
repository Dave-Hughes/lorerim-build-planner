import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { faqJsonLd, parseFaq, readFaq, slug } from "./faq";

const file = fs.readFileSync(path.join(process.cwd(), "content", "faq", "gameplay.md"), "utf8");

describe("the gameplay FAQ (WO-63)", () => {
  const faq = readFaq("gameplay");

  it("has a section per ## and a question per ### in the file", () => {
    expect(faq.sections).toHaveLength(file.match(/^## /gm)!.length);
    expect(faq.sections.flatMap((s) => s.questions)).toHaveLength(file.match(/^### /gm)!.length);
    expect(faq.sections).toHaveLength(9);
    expect(faq.sections.flatMap((s) => s.questions)).toHaveLength(44);
  });

  it("ids come from the question's text and are unique", () => {
    expect(slug("Why can't I fast travel?")).toBe("why-cant-i-fast-travel");
    const ids = faq.sections.flatMap((s) => s.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("why-cant-i-fast-travel");
  });

  it("renders tables, lists and code, and the byline", () => {
    const html = faq.sections.flatMap((s) => s.questions.map((q) => q.html)).join("");
    expect(html).toContain("<table>");
    expect(html).toContain("<ol>");
    expect(html).toContain("<code>");
    expect(faq.byline).toBe("For LoreRim 5.0.4.8");
  });

  it("a changed question in the file changes the page", () => {
    const changed = parseFaq(file.replace("### Why can't I fast travel?", "### Why can I never fast travel?"));
    expect(changed.sections.flatMap((s) => s.questions.map((q) => q.id))).toContain("why-can-i-never-fast-travel");
  });

  it("the structured data has one Question per ###, with plain-text answers", () => {
    const ld = faqJsonLd(faq);
    expect(ld.mainEntity).toHaveLength(44);
    expect(ld.mainEntity.every((m) => !/<\/?[a-z]/.test(m.acceptedAnswer.text))).toBe(true);
    expect(ld.mainEntity.find((m) => m.name === "Why can't I fast travel?")!.acceptedAnswer.text).toContain("MCM > Requiem > Atmosphere");
  });
});
