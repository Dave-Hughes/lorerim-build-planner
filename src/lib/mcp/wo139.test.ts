import { describe, expect, it } from "vitest";
import type { z } from "zod";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { modIndex, readGuide } from "@/lib/game-guide/guide";
import { modsInOrder, modsSchema, storedMods } from "@/lib/mods";
import { answersSchema, neverSchema } from "@/lib/playthroughs/validate";
import { registerBuildTools } from "./build-tools";
import { registerFactTools } from "./fact-tools";
import { FactsError, getQuest, neversOf, playerState, styleGuide } from "./facts";
import { registerPlaythroughTools } from "./playthrough-tools";
import { modsOf, neverWarnings, suggestFrom } from "./playthroughs";

/** WO-139: before you design. The questions in the guide, the answers kept, and a never list the planner keeps to. */

function descriptions() {
  const out = new Map<string, { description: string; inputSchema: z.ZodType }>();
  const server = { registerTool: (name: string, cfg: { description: string; inputSchema: z.ZodType }) => void out.set(name, cfg) };
  const guarded = async () => ({ content: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = server as any;
  registerFactTools(s, guarded);
  registerBuildTools(s, guarded, "https://planner.test");
  registerPlaythroughTools(s, guarded, "https://planner.test");
  return out;
}

const NEVER = [
  { what: "main-quest", words: "she won't be the Dragonborn" },
  { what: "the-dark-brotherhood", words: "she won't kill for the Dark Brotherhood" },
];

describe("Part 1: the questions in the style guide", () => {
  const guide = styleGuide();
  it("holds Before you design between How to build and Playthroughs, its eight always-ask questions numbered 27 to 34, in Dave's words", () => {
    expect(guide.indexOf("## How to build")).toBeLessThan(guide.indexOf("## Before you design"));
    expect(guide.indexOf("## Before you design")).toBeLessThan(guide.indexOf("## Playthroughs"));
    const asks = [
      "Will this character be the Dragonborn?",
      "How do they fight, once they do?",
      "How do they start out?",
      "Where is the line they won't cross?",
      "Any faction you want in, or out?",
      "Alone, or with someone?",
      "Do they want a home? A mount?",
      "Where does the story end?",
    ];
    asks.forEach((q, i) => expect(guide).toContain(`${27 + i}. ${q}`));
    // Ask about the whole run, whether not where, and the reason to travel isn't pressed.
    expect(guide).toContain("Ask about the whole run, not the first hour");
    expect(guide).not.toMatch(/What do they do when something attacks/);
    expect(guide).not.toMatch(/Do they want a home, and where/);
    expect(guide).toMatch(/^35\. Ask when it matters: which god/m);
    expect(guide).toMatch(/^36\. When a design depends on something LoreRim doesn't ship .*start with Callings, by name\. Never assume a mod is installed; the player decides\./m);
    expect(guide).not.toContain("Ask the player for it, or offer two or three that grow out of her story");
  });
  it("ends the section with the never line, and How to build says to settle the questions first", () => {
    const section = guide.slice(guide.indexOf("## Before you design"), guide.indexOf("## Playthroughs")).trim();
    expect(section.endsWith("Put what the answers close on the playthrough with set_details never, so the planner keeps to it.")).toBe(true);
    expect(guide).toContain("- Before create_build, settle the Before you design questions with the player (offer two or three answers each when they don't know), and keep their answers with set_details.");
  });
  it("create_build and create_playthrough point to it, and set_details takes answers and never", () => {
    const tools = descriptions();
    for (const t of ["create_build", "create_playthrough"]) expect(tools.get(t)!.description, t).toMatch(/Before you design questions \(rules 27 to 36\)/);
    const props = Object.keys((tools.get("set_details")!.inputSchema as z.ZodObject).shape);
    expect(props).toEqual(expect.arrayContaining(["build", "playthrough", "answers", "never", "mods"]));
    // The reason to travel isn't asked up front in create_playthrough either.
    expect(tools.get("create_playthrough")!.description).toContain("don't ask for it up front");
    expect(tools.get("create_playthrough")!.description).not.toContain("Settle the character's reason to travel");
  });
});

describe("Part 2: the answers, kept", () => {
  it("takes up to 12, each question and answer under 300 characters", () => {
    const one = { question: "Will this character be the Dragonborn?", answer: "No. She's a hunter from Falkreath, nothing more." };
    expect(answersSchema.safeParse([one]).success).toBe(true);
    expect(answersSchema.safeParse(Array(13).fill(one)).success).toBe(false);
    expect(answersSchema.safeParse([{ ...one, answer: "x".repeat(301) }]).success).toBe(false);
    expect(answersSchema.safeParse([{ ...one, answer: "" }]).success).toBe(false);
  });
});

describe("Part 3: what a character will never do", () => {
  it("reads a line or story by id or name, a side, a state and the player's own words, and refuses an id that names nothing", () => {
    const nv = neversOf([...NEVER, { what: "stormcloak" }, { what: "vampire" }, { what: "never kills for money" }]);
    expect(nv.items.map((n) => n.kind)).toEqual(["line", "line", "side", "state", "own"]);
    expect(nv.lines.get("main-quest")).toBe("she won't be the Dragonborn");
    expect(nv.lines.get("dark-brotherhood")).toBe("she won't kill for the Dark Brotherhood");
    expect([...nv.quests.values()]).toContain("the player said never to joining the Stormcloaks");
    expect(neversOf([{ what: "join-the-dark-brotherhood" }]).lines.has("dark-brotherhood")).toBe(true);
    expect(() => neversOf([{ what: "the-thieves-gild" }])).toThrow(FactsError);
    expect(neverSchema.safeParse(Array(21).fill({ what: "vampire" })).success).toBe(false);
  });

  it("suggest_quests leaves out the stories behind a never, and says so once", () => {
    const a = suggestFrom("https://planner.test", { level: 12 }, { level: 12, never: NEVER });
    const names = a.suggestions.map((s) => s.name);
    expect(names).not.toContain("Join the Dark Brotherhood");
    expect(names).not.toContain("Become the Dragonborn");
    expect(a.leftOut).toMatch(/^left out: 2 stories this character won't do \(/);
    expect(a.leftOut).toContain("she won't be the Dragonborn");
    // Without the never, the Brotherhood is offered.
    expect(suggestFrom("https://planner.test", { level: 12 }, { level: 12 }).suggestions.map((s) => s.name)).toContain("Join the Dark Brotherhood");
  });

  it("get_quest says locked for this character, in the player's words, before any level gate", () => {
    const p = playerState({ level: 12, never: NEVER });
    expect(getQuest({ name: "Dragonborn" }, undefined, p).openForYou?.says).toBe("locked for this character: she won't be the Dragonborn");
    expect(getQuest({ name: "The Dark Brotherhood" }, undefined, p).openForYou?.says).toBe("locked for this character: she won't kill for the Dark Brotherhood");
    // Dawnguard has a way in with no need on the main quest (Agmaer at Fort Dawnguard): never locked for her.
    expect(getQuest({ name: "Dawnguard" }, undefined, p).openForYou?.says).not.toMatch(/for this character/);
    // A side locks the war's quests that follow it, through their own checked needs.
    const side = playerState({ level: 12, never: [{ what: "imperial" }] });
    expect(getQuest({ id: "CW02A" }, undefined, side).openForYou?.says).toBe("locked for this character: the player said never to joining the Imperial Legion");
  });

  it("get_playthrough warns when an objective, a chapter's unlock or a route stop touches a never", () => {
    const pt = {
      never: NEVER,
      gameVersion: "5.0.4.8",
      view: {
        acts: [
          {
            n: 2,
            name: "East to Windhelm",
            route: [{ place: "Windhelm", why: "Aventus Aretino wants the Dark Brotherhood" }],
            objectives: [
              { id: 7, text: "Talk to Aventus Aretino", link: { kind: "quest", id: "DB01" }, detect: null },
              { id: 8, text: "Sell the pelts", link: null, detect: null },
            ],
          },
        ],
        chapters: [{ id: 3, title: "The Black Door", kind: "beat", inGame: { id: 7, text: "Talk to Aventus Aretino" } }],
      },
    } as unknown as PlaythroughRecord;
    const w = neverWarnings(pt).map((x) => x.message);
    expect(w).toContain('Act 2 East to Windhelm sends this character to Innocence Lost ("Talk to Aventus Aretino"); she won\'t kill for the Dark Brotherhood.');
    expect(w).toContain("Act 2 East to Windhelm's route stops at Windhelm for The Dark Brotherhood; she won't kill for the Dark Brotherhood.");
    expect(w).toContain('The chapter The Black Door unlocks when "Talk to Aventus Aretino" is done, at Innocence Lost; she won\'t kill for the Dark Brotherhood.');
    expect(w).toHaveLength(3);
    expect(neverWarnings({ ...pt, never: null } as PlaythroughRecord)).toEqual([]);
  });
});

describe("Part 4: the mods a character needs", () => {
  const CALLINGS = { name: "Callings", why: "A start that makes sense for a bard or a scholar, instead of crabs, wolves and bandits.", need: "required" as const };
  it("takes up to 12 mods, each with a name, a why and required or recommended; the link is optional and plain", () => {
    expect(modsSchema.safeParse([CALLINGS]).success).toBe(true);
    expect(modsSchema.safeParse([{ ...CALLINGS, link: "https://www.nexusmods.com/skyrimspecialedition/mods/1" }]).success).toBe(true);
    expect(modsSchema.safeParse([{ ...CALLINGS, link: "javascript:alert(1)" }]).success).toBe(false);
    expect(modsSchema.safeParse([{ ...CALLINGS, need: "optional" }]).success).toBe(false);
    expect(modsSchema.safeParse([{ ...CALLINGS, why: "" }]).success).toBe(false);
    expect(modsSchema.safeParse(Array(13).fill(CALLINGS)).success).toBe(false);
  });
  it("stores an empty list as none and drops an empty link", () => {
    expect(storedMods([])).toBeNull();
    expect(storedMods([{ ...CALLINGS, link: "" }])).toEqual([CALLINGS]);
  });
  it("lists required first, then recommended, a mod named on both the build and the run once", () => {
    const rec = { name: "Immersive Citizens", why: "Towns that react to her.", need: "recommended" as const };
    expect(modsOf([rec, CALLINGS]).map((m) => m.name)).toEqual(["Callings", "Immersive Citizens"]);
    expect(modsInOrder([CALLINGS], [{ ...CALLINGS, why: "again" }, rec]).required).toHaveLength(1);
  });
  it("the guide's mods page lists Callings, not yet published, with no link", () => {
    const callings = modIndex(readGuide()).find((m) => m.name === "Callings");
    expect(callings).toBeDefined();
    expect(callings!.nexus).toBeUndefined();
    expect(callings!.places[0].html).toContain("a bard playing the inn or a scholar reading every book in town");
    expect(callings!.places[0].html).toContain("instead of opening on crabs, wolves and bandits");
  });
});
