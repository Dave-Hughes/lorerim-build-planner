import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MentionChip } from "@/components/guide/mention-chip";
import { requireGameData } from "@/lib/rules/data";
import { guideDocSchema } from "./doc";
import { itemMention, mentionFallbackLabel, resolveMention, searchMentions } from "./mention";

const d = requireGameData("5.0.4.8");
const chip = (kind: string, id: string, takenAt?: number[] | null) =>
  renderToStaticMarkup(createElement(MentionChip, { info: resolveMention(d, kind, id), missingLabel: mentionFallbackLabel(id), version: d.version.id, takenAt }));

describe("mentions", () => {
  it("give a weapon its own type's icon, and armor its gear type's", () => {
    const bow = itemMention({ id: "Skyrim.esm:0139A5", name: "Glass Light Bow", kind: "weapon", weaponType: "Bow", stats: "Bow, 40 damage, 9 weight" });
    expect(bow.icon).toEqual({ type: "weapon", name: "Bow", ammo: false });
    expect(renderToStaticMarkup(createElement(MentionChip, { info: bow, missingLabel: "", version: d.version.id }))).toContain("/icons/weapon-bow.svg");
    const arrow = itemMention({ id: "Skyrim.esm:0139BE", name: "Glass Arrow", kind: "ammo", weaponType: "Arrow", stats: "Arrow, 78 damage" });
    expect(renderToStaticMarkup(createElement(MentionChip, { info: arrow, missingLabel: "", version: d.version.id }))).toContain("/icons/weapon-arrow.svg");
    const cuirass = itemMention({ id: "Skyrim.esm:013939", name: "Glass Cuirass", kind: "armor", slot: "Body", type: "Body", stats: "Light armor, 275 armor, 12.5 weight" });
    expect(cuirass.icon).toEqual({ type: "slot", name: "Body" });
  });

  it("resolve against the build's version, from kind and id only", () => {
    const p = resolveMention(d, "perk", "Block:Powerful Bashes");
    expect(p?.name).toBe("Powerful Bashes");
    expect(p?.kindLabel).toBe("Perk, Block");
    expect(p?.text.length).toBeGreaterThan(10);
    expect(resolveMention(d, "trait", "Bulwark")?.kindLabel).toBe("Trait");
    expect(resolveMention(d, "stone", "Lover")?.name).toBe("The Lover Stone");
    expect(resolveMention(d, "race", "Nord")?.icon).toEqual({ type: "race", name: "Nord" });
    // A Destiny perk is only a "destiny" mention, a skill perk only a "perk" one.
    expect(resolveMention(d, "destiny", "Block:Powerful Bashes")).toBeNull();
    expect(resolveMention(d, "perk", "Block:No Such Perk")).toBeNull();
  });

  it("search: names that start with the query come first", () => {
    const r = searchMentions(d, "bul");
    expect(r[0].name.toLowerCase().startsWith("bul")).toBe(true);
    expect(r.some((m) => m.kind === "trait" && m.id === "Bulwark")).toBe(true);
    expect(searchMentions(d, "lord").map((m) => m.kindLabel)).toEqual(expect.arrayContaining(["Birthsign", "Standing stone"]));
  });

  it("store only kind and id", () => {
    const doc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "mention", attrs: { kind: "trait", id: "Bulwark", label: "Bulwark" } }] }] };
    const r = guideDocSchema.safeParse(doc);
    expect(r.success).toBe(true);
    expect(JSON.stringify(r.data)).not.toContain("label");
    expect(guideDocSchema.safeParse({ type: "doc", content: [{ type: "paragraph", content: [{ type: "mention", attrs: { kind: "shout", id: "x" } }] }] }).success).toBe(false);
    // Items keep their name, shown until the item index is fetched.
    const item = guideDocSchema.safeParse({ type: "doc", content: [{ type: "paragraph", content: [{ type: "mention", attrs: { kind: "item", id: "Skyrim.esm:012EB7", label: "Iron Dagger" } }] }] });
    expect(JSON.stringify(item.data)).toContain('"label":"Iron Dagger"');
  });
});

describe("chip renderer", () => {
  it("draws a perk with its icon, name, the game's text and where the build takes it", () => {
    const html = chip("perk", "Block:Powerful Bashes", [6]);
    expect(html).toContain("/icons/block.svg");
    expect(html).toContain("Powerful Bashes");
    expect(html).toContain("Perk, Block");
    expect(html).toContain("Taken at level 6");
    expect(html).toContain('role="tooltip"');
  });

  it("says when the build doesn't take a perk", () => {
    expect(chip("perk", "Block:Overpowering Bashes", [])).toContain("Not taken in this build");
  });

  it("draws a trait with its picture and its text, no level line", () => {
    const html = chip("trait", "Bulwark", null);
    expect(html).toContain("/traits/");
    expect(html).not.toContain("Taken at level");
  });

  it("draws a thing this version doesn't have as plain text with a dotted underline", () => {
    const html = chip("perk", "Block:Shield of the Old Kings");
    expect(html).toContain("Shield of the Old Kings");
    expect(html).toContain("Not in LoreRim 5.0.4.8");
    expect(html).not.toContain("/icons/");
  });
});

describe("spell mentions (WO-42)", () => {
  it("find spells by name, with the school's icon and the game's text", () => {
    const d = requireGameData("5.0.4.8");
    const hit = searchMentions(d, "fireball").find((m) => m.kind === "spell");
    expect(hit).toMatchObject({ name: "Fireball", kindLabel: "Spell, Destruction, Adept, Fire and forget", icon: { type: "skill", name: "Destruction" } });
    expect(hit?.text).toContain("deals 40 fire damage");
  });
});
