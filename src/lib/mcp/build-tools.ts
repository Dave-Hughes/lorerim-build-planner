import "server-only";
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { writer, type PlannerAuth } from "@/lib/oauth/mcp-auth";
import { DEFAULT_VERSION, FactsError } from "./errors";
import { setAbout } from "./playthroughs";
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
    .describe('The choice a trait asks, by trait, in the game\'s option names: { "Fatal Attraction": "Female", "Focused Combat": "Two-Handed", "Focused Magic": "Destruction" }. get_creation lists them.'),
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
    "Make a new private build in the player's account at level 1 from character creation's choices, by the game's names, checked as the site's Set up checks them: 3 majors, 6 minors, a birthsign, a start and its option, each trait's choice. Refused with every choice still to make, and the options. Call get_creation first for the choices, get_rules for how points work, and get_tree to plan a skill's perks. Before it, settle the style guide's Before you design questions (rules 27 to 36) with the player, and keep their answers with set_details.",
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
  // set_details (WO-139): the build's details need builds:write; the answers and never, kept on the run, playthroughs:write too.
  server.registerTool(
    "set_details",
    {
      title: "Set the details",
      description:
        "Set the name, description, notes, tags (by slug) or main spells (by name) of one of the player's builds; and the character's Before you design answers, what they will never do, and the mods they need (style guide rules 27 to 36). answers and never are kept on the character's run: the playthrough named, or the run on the build named. mods go on the playthrough when one is named, else on the build. Each is the whole list each time; an empty list clears it.",
      inputSchema: z.object({
        build: build.optional().describe("The build's id, from create_build or list_my_builds. Needed for the build's own details."),
        playthrough: z.string().min(1).max(80).optional().describe("The character's run, by id or name, for answers and never; the run on build when left out."),
        name: z.string().max(80).optional(),
        description: z.string().max(300).optional(),
        notes: z.string().max(6000).optional(),
        tags: z.array(z.string().max(40)).max(10).optional(),
        mainSpells: z.array(z.string().max(120)).max(8).optional(),
        answers: z
          .array(z.object({ question: z.string().min(1).max(300).describe("The question, as you asked it."), answer: z.string().min(1).max(300).describe("The player's answer, in their words.") }))
          .max(12)
          .optional()
          .describe("The Before you design questions you settled with the player, and their answers: up to 12."),
        never: z
          .array(
            z.object({
              what: z.string().min(1).max(120).describe('A quest line or story id ("main-quest", "the-dark-brotherhood"), a side ("imperial", "stormcloak"), a state ("vampire", "werewolf"), or a line in the player\'s words ("never kills for money").'),
              words: z.string().max(300).optional().describe('How the player said it, said back when something is left out: "she won\'t be the Dragonborn".'),
            }),
          )
          .max(20)
          .optional()
          .describe("What the character will never do, from the answers. The planner keeps to quest lines, stories and sides."),
        mods: z
          .array(
            z.object({
              name: z.string().min(1).max(80).describe('The mod\'s name ("Callings").'),
              link: z.string().max(500).optional().describe("The Nexus or other page for the mod. Leave it out when it isn't published yet."),
              why: z.string().min(1).max(300).describe("One line: what this character needs it for."),
              need: z.enum(["required", "recommended"]),
            }),
          )
          .max(12)
          .optional()
          .describe("Mods this character needs that LoreRim doesn't ship (rule 36), kept on the playthrough when one is named, else on the build. The whole list each time; an empty list clears it."),
      }),
    },
    async (args: unknown, ctx: Ctx) =>
      guarded(async () => {
        const a = args as Parameters<typeof setDetails>[1] & Parameters<typeof setAbout>[1] & { build?: string };
        const auth = ctx.http?.authInfo as PlannerAuth | undefined;
        const modsOnRun = a.mods !== undefined && !!a.playthrough;
        const own = a.name !== undefined || a.description !== undefined || a.notes !== undefined || a.tags !== undefined || a.mainSpells !== undefined || (a.mods !== undefined && !modsOnRun);
        const about = a.answers !== undefined || a.never !== undefined || modsOnRun;
        if (!a.build && !a.playthrough) throw new FactsError("Name the build, or the playthrough for answers and never.");
        if (own && !a.build) throw new FactsError("Name the build for its name, description, notes, tags or main spells, or for mods when no playthrough is named.");
        let out: Record<string, unknown> = {};
        if (about) {
          const w = await writer(auth, "playthroughs:write");
          if ("refusal" in w) throw new FactsError(w.refusal);
          out = { ...(await setAbout({ ...w, origin }, { ...a, mods: modsOnRun ? a.mods : undefined })) };
        }
        if (own || !about) {
          const w = await writer(auth, "builds:write");
          if ("refusal" in w) throw new FactsError(w.refusal);
          out = { ...(await setDetails({ ...w, origin }, { ...a, build: a.build! })), ...out };
        }
        return out;
      }),
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
