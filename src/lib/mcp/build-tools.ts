import "server-only";
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { writer, type PlannerAuth } from "@/lib/oauth/mcp-auth";
import { DEFAULT_VERSION, FactsError } from "./errors";
import { addLevel, createBuild, finishDraft, getBuild, listMyBuilds, removeLastLevel, setCreation, setDetails, setGear, setLevel, type Player } from "./builds";

/** The build tools' registration on the MCP server (WO-110), each needing a sign-in with builds:write. */

type Server = Parameters<Parameters<typeof createMcpHandler>[0]>[0];
type Guarded = (run: () => unknown | Promise<unknown>) => Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>;
type Ctx = { http?: { authInfo?: unknown } };

const build = z.string().min(1).max(40).describe("The build's id, from create_build or list_my_builds.");
const name = (what: string) => z.string().min(1).max(120).describe(what);

/** One level's choices, by the game's names. Shared by add_level, set_level and the plain build shape. */
export const levelFields = {
  attribute: z.string().max(20).optional().describe("Health, Magicka or Stamina. Not at level 1."),
  skillPoints: z.record(z.string(), z.number().int().min(0).max(100)).optional().describe('Skill points spent at this level, by skill name: { "Two-Handed": 3 }.'),
  perks: z.array(z.string().max(120)).max(20).optional().describe('Perks taken, by name or Tree:Name ("Two-Handed:Barbarian"); "Name (2/3)" for a later rank.'),
  destiny: z.array(z.string().max(120)).max(10).optional().describe("Destiny perks taken, by name."),
  extras: z.array(z.object({ kind: z.enum(["trainer", "book"]), skill: z.string().max(40) })).max(20).optional().describe("Trainer sessions and skill books since the last level."),
  spells: z.array(z.object({ name: z.string().max(120), where: z.string().max(120).optional() })).max(30).optional().describe("Spells learned, by name, and where."),
  stone: z.string().max(60).optional().describe('A standing stone change, by name, or "none".'),
  deity: z.string().max(60).optional().describe("A deity change, by name."),
  note: z.string().max(2000).optional().describe("What the player does at this level and why."),
};

export const creationFields = {
  race: name("The race, by name."),
  birthsign: z.string().max(60).optional().describe("The birthsign, by name."),
  mode: z.string().max(20).optional().describe("Naaktiid or Konahrik. Naaktiid if left out."),
  deity: z.string().max(60).optional().describe("The deity followed from the start, by name."),
  start: z.string().max(120).optional().describe("The game start, by name."),
  startOption: z.string().max(120).optional().describe("The start's one choice (an inn, a hold), when it has one."),
  majors: z.array(z.string().max(40)).max(10).describe("Major skills, by name."),
  minors: z.array(z.string().max(40)).max(10).describe("Minor skills, by name."),
  traits: z.array(z.string().max(80)).max(5).optional().describe("Traits, by name."),
  traitChoices: z
    .record(z.string().max(80), z.string().max(40))
    .optional()
    .describe('The choice a trait asks, by trait, in the game\'s option names: { "Fatal Attraction": "Female", "Focused Combat": "Two-Handed", "Focused Magic": "Destruction" }.'),
  masterOfOneSkill: z.string().max(40).optional().describe("Master of One's skill, by name, when it's one of traits."),
  notes: z.string().max(6000).optional().describe("The build's overall notes."),
};

export const gearRow = z.object({
  slot: z.string().max(40).describe("The gear type: Main hand, Off hand, Head, Body, Hands, Feet, Ring, Amulet, Cloak..."),
  name: z.string().max(120).describe("The item, by name as on the Gear page; empty to take off what `replaces` names."),
  fromLevel: z.number().int().min(1).max(100),
  note: z.string().max(300).optional(),
  replaces: z.string().max(120).optional().describe("The piece of that type this one takes the place of."),
});

export function registerBuildTools(server: Server, guarded: Guarded, origin: string) {
  /** Every build tool's run: signed in with builds:write, then the tool. */
  const as = (ctx: Ctx, run: (p: Player) => unknown | Promise<unknown>) =>
    guarded(async () => {
      const w = await writer(ctx.http?.authInfo as PlannerAuth | undefined, "builds:write");
      if ("refusal" in w) throw new FactsError(w.refusal);
      return run({ ...w, origin });
    });
  const tool = (id: string, title: string, description: string, inputSchema: z.ZodObject, run: (p: Player, args: never) => unknown) =>
    server.registerTool(id, { title, description, inputSchema }, async (args: unknown, ctx: Ctx) => as(ctx, (p) => run(p, args as never)));

  tool(
    "create_build",
    "Start a build",
    "Make a new private build in the player's account at level 1 from character creation's choices, by the game's names, checked as the site's Set up checks them: 3 majors, 6 minors, a birthsign, a start and its option, each trait's choice. Refused with every choice still to make, and the options. Call get_rules first for how points work, and get_tree to plan a skill's perks.",
    z.object({ name: name("The build's name."), description: z.string().max(300).optional(), version: z.string().max(20).optional().describe(`The LoreRim version, ${DEFAULT_VERSION} if left out.`), ...creationFields }),
    (p, a: Parameters<typeof createBuild>[1]) => createBuild(p, a),
  );
  tool(
    "add_level",
    "Add the next level",
    "Add the next level to one of the player's builds; the planner checks the whole build and saves nothing if any level breaks a rule, answering with the rule and the level. Unspent skill points carry to the next level, as on the site.",
    z.object({ build, ...levelFields }),
    (p, a: Parameters<typeof addLevel>[1]) => addLevel(p, a),
  );
  tool(
    "set_level",
    "Change a level",
    "Replace one level's choices in one of the player's builds; levels after it are checked again and the first rule broken stops the save.",
    z.object({ build, level: z.number().int().min(1).max(100), ...levelFields }),
    (p, a: Parameters<typeof setLevel>[1]) => setLevel(p, a),
  );
  tool(
    "set_creation",
    "Change character creation",
    "Change character creation's choices on one of the player's builds: race, birthsign, mode, deity, start and its option, majors, minors, traits and their choices. Only the fields sent change. Creation is checked as the site's Set up checks it, and every level again; nothing is saved if a rule breaks, and the answer names it.",
    z.object({ build, ...Object.fromEntries(Object.entries(creationFields).filter(([k]) => k !== "notes").map(([k, v]) => [k, v.optional()])) }),
    (p, a: Parameters<typeof setCreation>[1]) => setCreation(p, a),
  );
  tool("remove_last_level", "Remove the last level", "Drop the last level of one of the player's builds; level 1 always stays.", z.object({ build }), (p, a: { build: string }) => removeLastLevel(p, a));
  tool(
    "set_gear",
    "Set the gear",
    "Set the whole gear list of one of the player's builds, each piece by name with its type and the level it's worn from.",
    z.object({ build, gear: z.array(gearRow).max(60) }),
    (p, a: Parameters<typeof setGear>[1]) => setGear(p, a),
  );
  tool(
    "set_details",
    "Set the details",
    "Set the name, description, notes, tags (by slug) or main spells (by name) of one of the player's builds.",
    z.object({ build, name: z.string().max(80).optional(), description: z.string().max(300).optional(), notes: z.string().max(6000).optional(), tags: z.array(z.string().max(40)).max(10).optional(), mainSpells: z.array(z.string().max(120)).max(8).optional() }),
    (p, a: Parameters<typeof setDetails>[1]) => setDetails(p, a),
  );
  tool("get_build", "Read a build", "Get one of the player's builds in the same plain shape the inputs use, each level with its state, plus its review link and who can see it. Unspent skill points carry to the next level, as on the site.", z.object({ build }), (p, a: { build: string }) => getBuild(p, a));
  tool("list_my_builds", "List the player's builds", "List the signed-in player's builds: id, name, who can see it, levels, last change, whether an assistant drafted it, and its run when it has one.", z.object({}), (p) => listMyBuilds(p));
  tool(
    "finish_draft",
    "Check a draft is ready",
    "Check one of the player's builds once more; answers with its review link when the whole build passes, or the issues. It changes nothing: the player publishes on the site.",
    z.object({ build }),
    (p, a: { build: string }) => finishDraft(p, a),
  );
}
