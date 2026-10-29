import { describe, expect, it } from "vitest";
import { searchWithExtras } from "@/lib/guide/mention";
import { personLinkables, questLinkables, resolveLink } from "./links";
import { editBase, editPlayHref, editStoryHref } from "./hrefs";
import { resolveLinkName } from "@/lib/mcp/playthroughs";
import { currentVersion } from "@/lib/rules/server";
import { requireGameData } from "@/lib/rules/server";

/** WO-179 Part 2: what the objective box offers (people too), and where a run is edited (under its character). */

const d = requireGameData(currentVersion().id);
const extras = [...questLinkables(), ...personLinkables()].map(({ kind, id, name, where }) => ({ kind, id, name, where }));

describe("what to do offers people", () => {
  it("offers Keerava, the innkeeper, as someone to link", () => {
    const hits = searchWithExtras(d, "Keerava", extras, ["spell", "item"], 6);
    expect(hits[0]).toMatchObject({ kind: "person", name: "Keerava" });
    expect(hits[0].where).toMatch(/Innkeeper/);
  });
  it("links by the person page's slug, and the link finds the person again", () => {
    const link = resolveLinkName(currentVersion().id, { kind: "person", name: "Keerava" });
    expect(link.link).toEqual({ kind: "person", id: "keerava" });
    expect(resolveLink(d, link.link)).toMatchObject({ name: "Keerava", href: "/people/keerava", tag: "Person" });
  });
  it("leaves a follower to the follower lines, so Lydia is offered once", () => {
    const lydia = extras.filter((x) => x.name === "Lydia");
    expect(lydia.length).toBeLessThanOrEqual(1);
  });
});

describe("where a run is edited", () => {
  it("is under its character, and under /p/ only while it has none", () => {
    expect(editBase({ id: "run1", buildId: "ch1" })).toBe("/b/ch1/edit");
    expect(editPlayHref({ id: "run1", buildId: "ch1" }, 4)).toBe("/b/ch1/edit/play?act=4");
    expect(editStoryHref({ id: "run1", buildId: "ch1" })).toBe("/b/ch1/edit/story/title");
    expect(editStoryHref({ id: "run1", buildId: "ch1" }, 9)).toBe("/b/ch1/edit/story/9");
    expect(editPlayHref({ id: "run1", buildId: null })).toBe("/p/run1/edit/play");
    expect(editStoryHref({ id: "run1" }, "act-3")).toBe("/p/run1/edit/story/act-3");
  });
});
