import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkGuide, modIndex, parseChapter, parseTerms, readGuide } from "./guide";

const dir = path.join(process.cwd(), "content", "guide");
const files = fs.readdirSync(dir).filter((f) => /^\d+-.+\.md$/.test(f));
const all = files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n");

const ok = `---
chapter: 1
title: Test
---

The lead.

## One {#one}

Text with [[F1]].

:::more
- Detail.
:::

:::mods
- **A Mod**: Does a thing.
  - where: \`file.ini\`
  - tag: Key can be changed
:::

:::ask{q="Why?"}
Because.
:::
`;

describe("the guide (WO-66)", () => {
  it("reads every chapter, section, mods block and question in the files", () => {
    const g = readGuide();
    expect(g.chapters).toHaveLength(11);
    expect(g.chapters.map((c) => c.slug)).toContain("fighting");
    const sections = g.chapters.flatMap((c) => c.sections);
    expect(sections).toHaveLength(all.match(/^## /gm)!.length);
    expect(sections).toHaveLength(67);
    expect(sections.filter((s) => s.mods)).toHaveLength(all.match(/^:::mods/gm)!.length);
    expect(sections.filter((s) => s.more)).toHaveLength(all.match(/^:::more/gm)!.length);
    expect(sections.flatMap((s) => s.asks)).toHaveLength(49);
    const ids = sections.flatMap((s) => s.asks.map((a) => a.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(modIndex(g).length).toBeGreaterThan(10);
  });

  it("parses the format: lead, sections, blocks, mods items and key caps", () => {
    const c = parseChapter(ok, "01-test.md");
    expect(c.slug).toBe("test");
    expect(c.lead).toContain("The lead.");
    expect(c.sections[0]).toMatchObject({ id: "one", title: "One" });
    expect(c.sections[0].html).toContain("<kbd>F1</kbd>");
    expect(c.sections[0].more).toContain("<li>Detail.</li>");
    expect(c.sections[0].mods).toEqual([{ name: "A Mod", html: "Does a thing.", where: "<code>file.ini</code>", tag: "Key can be changed" }]);
    expect(c.sections[0].asks[0]).toMatchObject({ id: "why", question: "Why?", text: "Because." });
  });

  it("fails on a broken file, naming the file and line", () => {
    expect(() => parseChapter(ok.replace(":::\n\n:::mods", "\n:::mods"), "01-test.md")).toThrow(/content\/guide\/01-test\.md:\d+: The :::more block is not closed/);
    expect(() => parseChapter(ok.replace(/:::more\n- Detail\.\n:::\n\n/, "") + "\n:::more\n- Late.\n:::\n", "01-test.md")).toThrow(/01-test\.md:\d+: The :::more block is out of order/);
    expect(() => parseChapter(ok + "\n## Again {#one}\n\nText.\n", "01-test.md")).toThrow(/01-test\.md:\d+: Two sections have the id "one"/);
    const dead = parseChapter(ok.replace("Text with", "See [it](/guide/nowhere#here). Text with"), "01-test.md");
    expect(() => checkGuide([dead])).toThrow(/01-test\.md:\d+: The link \/guide\/nowhere#here goes to no chapter or section/);
    const deadSection = parseChapter(ok.replace("Text with", "See [it](/guide/test#nope). Text with"), "01-test.md");
    expect(() => checkGuide([deadSection])).toThrow(/goes to no chapter or section/);
    expect(() => checkGuide([parseChapter(ok.replace("Text with", "See [it](/guide/test#one). Text with"), "01-test.md")])).not.toThrow();
  });

  it("reads every term in terms.md, and every mark in the chapters is one of them", () => {
    const termsMd = fs.readFileSync(path.join(dir, "terms.md"), "utf8");
    const g = readGuide();
    expect(g.terms).toHaveLength(termsMd.match(/^## /gm)!.length);
    expect(g.terms).toHaveLength(191);
    const marks = all.match(/\{\{[^}]+\}\}/g)!.length;
    const rendered = g.chapters.flatMap((c) => [c.lead, ...c.sections.flatMap((s) => [s.html, s.more ?? "", ...(s.mods ?? []).flatMap((m) => [m.html, m.where ?? ""]), ...s.asks.map((a) => a.html)])]).join("").match(/class="guide-term"/g)!.length;
    expect(rendered).toBe(marks);
    // Mods with a Nexus id, as the files give them.
    const ids = all.match(/^ {2}- nexus:/gm)!.length;
    expect(g.chapters.flatMap((c) => c.sections.flatMap((s) => s.mods ?? [])).filter((m) => m.nexus)).toHaveLength(ids);
  });

  it("fails on an unknown term or a dead see link, naming the file and line", () => {
    const terms = parseTerms("## Mod Organizer 2 {#mo2}\n- aka: MO2\nThe program.\n");
    expect(parseChapter(ok.replace("Text with", "Start {{MO2}}. Text with"), "01-test.md", terms).sections[0].html).toContain('data-term="mo2"');
    expect(() => parseChapter(ok.replace("Text with", "Start {{Nothing Here}}. Text with"), "01-test.md", terms)).toThrow(/content\/guide\/01-test\.md:10: No term is called "Nothing Here"/);
    expect(() => parseChapter(ok.replace("Text with", "Start {{it|nope}}. Text with"), "01-test.md", terms)).toThrow(/01-test\.md:10: No term has the id "nope"/);
    const dead = parseTerms("## Thing {#thing}\nA thing.\n- see: /guide/test#nowhere\n");
    expect(() => checkGuide([parseChapter(ok, "01-test.md")], dead.terms)).toThrow(/content\/guide\/terms\.md:3: The see: link \/guide\/test#nowhere goes to no chapter or section/);
  });
});
