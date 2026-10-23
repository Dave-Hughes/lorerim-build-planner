import { afterAll, describe, expect, it } from "vitest";
import { FactsError, getQuest, playerState, searchFacts } from "./facts";
import { suggestQuests } from "./playthroughs";
import { questLog } from "./quest-log";
import { questsData } from "@/lib/quests/data";

/**
 * The player's questions (WO-135, docs/player-questions.md): each asked as a player types it, run through the door's own
 * handlers on the real data, and its answer checked for the facts it must hold and the ones it never may. A question that
 * fails today is marked with the order that fixes it and runs as an expected failure, so it goes red the day it passes and
 * someone takes the mark off. `npm run test:questions` prints every question with pass or fail and what it got.
 */

type Want = string | RegExp;
interface Question {
  n: number;
  asks: string;
  /** The tool calls an assistant makes, as the handlers take them: what they give back, in order. */
  ask: () => Promise<unknown[]> | unknown[];
  must: Want[];
  never?: Want[];
  /** The order that fixes it, while it fails. */
  todo?: string;
}

// Never in an answer (outside the ids an assistant passes back): an editor id, a form id, a raw condition function, or a
// person the records don't name. The record form (raw) no longer goes through the door (WO-136), so nothing is skipped for it.
const NEVER: Want[] = [/\b[A-Za-z]+_[A-Za-z]\w*/, /\bcc[A-Z]\w*/, /\.es[mpl]:/i, /\b(Get[A-Z]\w+|fn\d+)\b/, /someone the records don't name/];

/** What an assistant tells the player from: every value but the ids it passes back. */
function said(o: unknown): string {
  if (Array.isArray(o)) return o.map(said).join("\n");
  if (o && typeof o === "object") return Object.entries(o).filter(([k]) => !["edid", "id", "link", "story", "playthrough"].includes(k)).map(([, v]) => said(v)).join("\n");
  return o === null || o === undefined ? "" : String(o);
}

/** A tool call as the door answers it: its result, or the error text it sends back. */
async function call(run: () => unknown): Promise<unknown> {
  try {
    return await run();
  } catch (e) {
    if (e instanceof FactsError) return { error: e.message };
    throw e;
  }
}

const has = (text: string, w: Want) => (typeof w === "string" ? text.toLowerCase().includes(w.toLowerCase()) : w.test(text));

/** The read-this ways (WO-131): every quest whose way in is reading something, with that way. */
const readThis = () =>
  questsData().lines.flatMap((l) => l.quests.flatMap((q) => (q.start?.ways ?? []).filter((w) => /^(Read|Get a note) /.test(w.how)).map((w) => ({ q, how: w.how }))));

const QUESTIONS: Question[] = [
  {
    n: 1,
    asks: "In LoreRim, how do I start the quest called Palonimo?",
    ask: async () => {
      const found = searchFacts("Palonimo");
      const first = found.hits[0];
      return [found, ...(first ? [await call(() => getQuest({ id: first.id }))] : [])];
    },
    must: ["Running Wild", /note/i, /Joslin/, /Bannered Mare/],
  },
  {
    n: 2,
    asks: "How do I start Running Wild?",
    ask: () => [getQuest({ name: "Running Wild" })],
    must: [/note/i, /board/i, /Joslin/, /Bannered Mare/, /player/i, /Catch the white, or palonimo, horse/],
  },
  {
    n: 3,
    asks: "How do I start Blood on the Ice?",
    ask: async () => [await call(() => getQuest({ name: "Blood on the Ice" })), getQuest({ id: "MS11" })],
    must: [/at night in Windhelm, after you've come in four times/, /Windhelm guard/i, "Question the witnesses"],
  },
  {
    n: 4,
    asks: "How do I start Caught Red Handed?",
    ask: () => [getQuest({ name: "Caught Red Handed" })],
    must: ["Svana Far-Shield", "Haelga's Bunkhouse", /condition the planner can't put in words yet/, /Obtain a Mark of Dibella from Bolli/],
  },
  {
    n: 5,
    asks: "How do I start The Blessings of Nature?",
    ask: () => [getQuest({ name: "The Blessings of Nature" })],
    must: ["Danica Pure-Spring", "Temple of Kynareth", "Whiterun", '"then":"Retrieve Nettlebane"'],
    never: ['"then":"Inspect the Temple of Kynareth"'],
  },
  {
    n: 6,
    asks: "Where do I find the book for Running Wild?",
    ask: () => [getQuest({ name: "Running Wild" })],
    must: [/outside Joslin's house|where to find it isn't checked yet/i],
  },
  {
    n: 7,
    asks: "Where do I find the book for each of the other read-this starts?",
    ask: () =>
      readThis()
        .filter(({ q }) => q.edid !== "0WRHorseQ")
        .map(({ q, how }) => {
          // The way as get_quest gives it: where the thing is, or that where to find it isn't checked.
          const way = (getQuest({ id: q.edid }).quest.start.ways ?? []).find((w) => w.way === how);
          const answer = way?.whereIs?.join("; ") ?? way?.whereIsIt ?? "no place, and not said it isn't checked";
          return { quest: q.name, way: how, answer };
        }),
    must: [],
    never: [/no place, and not said it isn't checked/],
  },
  {
    n: 8,
    asks: "What quests are in my quest log?",
    // get_quest_log's own answer from a stored snapshot (the handler needs a signed-in playthrough; this is what it returns).
    ask: () => [questLog({ label: "Save 70", level: 10, day: 15, place: "Ivarstead", questStages: { "0WRHorseQ": 10, MS11: 100, MQ101RescueHelper: 20 } })],
    must: [/Running Wild/, /Catch the white, or palonimo, horse/, /Blood on the Ice/, /Wuunferth|Calixto/, /background quest/],
    never: [/MQ101RescueHelper/],
  },
  {
    n: 9,
    asks: "What can Kyria do at level 6 in Riften?",
    ask: async () => [
      await suggestQuests("https://planner.test", { level: 6, where: "Riften" }, null),
      getQuest({ name: "Caught Red Handed" }, undefined, playerState({ level: 6, done: [] })),
    ],
    must: [/open for you/, /unknown: .*isn't named yet/],
    never: [/Dark Brotherhood/],
  },
  {
    n: 10,
    asks: "What do I need for Bleak Falls Barrow at level 5?",
    ask: () => [getQuest({ name: "Bleak Falls Barrow" }, undefined, playerState({ level: 5, done: [] }))],
    must: ["Farengar", /Dragonstone/, /Before the Storm/, /"openForYou":\{"state":"(open|locked|unknown)"/],
  },
  {
    n: 11,
    asks: "What quests are near me? (in Whiterun)",
    ask: async () => [await suggestQuests("https://planner.test", { level: 10, where: "Whiterun" }, null)],
    must: [/"suggestions":\[\{"/],
    never: [/Thieves Guild/, /Dark Brotherhood/],
  },
  {
    n: 12,
    asks: "How do I start Deathbrand?",
    ask: () => [getQuest({ name: "Deathbrand" }, undefined, playerState({ level: 10, done: [] }))],
    // The level-up way with its level; Geldis only with his condition; the book's places with a way to see all of them.
    // The level gate on the ways in (the PC's check, 22 Oct: the level-up node is the gate; the book and the pirates at
    // Haknir's Shoal are the ways, each at level 20).
    must: [/"way":"Read Deathbrand"[^}]*"needs":\["Level 20"\]/, /Haknir's Shoal/, /"[^"]*Geldis Sadri[^}]*Deathbrand stage 20|^(?![\s\S]*Geldis Sadri)[\s\S]*"/, /places: true/],
    never: [/and \d+ more places/],
  },
  {
    n: 13,
    asks: "How do I start a missive from the notice board?",
    ask: () => [getQuest({ name: "Missives" }), getQuest({ id: questsData().byId.get("missives")!.quests[0].edid })],
    must: ["Ben Erai", "Winterhold", /notice board/, /"checked":"files"/],
    never: [/hasn't passed the planner's start check/, /no instructions are given/, /"checked":"not yet"/],
  },
  {
    n: 14,
    asks: "What quests are in my quest log? (Kyria's Save 70)",
    // Save 70's faults as Bob read them (22 Oct): helpers in the log, quests at stage 0, two quests of one name. The stages
    // here are the ones he named, not the whole save (no copy of it is in the repo).
    ask: () => [
      questLog({
        label: "Save 70",
        level: 12,
        day: 31,
        place: "Ivarstead",
        questStages: { "0WRHorseQ": 10, TG00MiscHandler: 10, LTNQuestHandler: 10, CR01: 10, CR02: 10, FreeformRiften15: 10, FreeformShorsStone02: 10, MS11: 0, MS13: 0, FreeformRiften11: 12 },
      }),
    ],
    must: [/"category":"Side stories"/, /"category":"Jobs and errands"/, /Running Wild/],
    never: [/Misc Handler/, /Quest Handler/, /Handler/, /"stage":0\b/, /Animal Extermination[\s\S]*Animal Extermination/, /Special Delivery[\s\S]*Special Delivery/],
  },
  {
    n: 15,
    asks: "How do I free Inigo from the jail?",
    ask: async () => {
      const found = searchFacts("free Inigo");
      return [found, await call(() => getQuest({ id: "inigo" }))];
    },
    must: [/"name":"Inigo"/, /Riften Jail/],
    never: [/no quest matched|No quest, quest line or story/i],
  },
  {
    n: 16,
    asks: "A quest in a line that hasn't passed the line's start check gives its own checked start",
    ask: () => [getQuest({ name: "Running Wild" }), getQuest({ name: "Caught Red Handed" }), getQuest({ name: "Deathbrand" })],
    must: [/"checked":"files"/, /Read the note pinned to the board/, "Svana Far-Shield"],
    never: [/no instructions are given/],
  },
  {
    n: 17,
    asks: "How do I start the quest to get the paraglider? I'm level 12.",
    ask: async () => {
      const found = searchFacts("paraglider");
      return [found, await call(() => getQuest({ name: "Paragliding in Skyrim" }, undefined, playerState({ level: 12, done: [] })))];
    },
    must: [/near Falkreath/, /falls from the sky|fell from the sky|falls out of the sky/i, /journal/i, /"state":"open"/],
    never: [/Para Intro Gazebo/, /Gazebo Discover/],
  },
  {
    n: 18,
    asks: "How do I become Thane of Whiterun?",
    ask: () => {
      const a = getQuest({ name: "Thane of Whiterun" });
      // Every way in names its place: a way with none is said as such, so it shows up in "never".
      const placeless = (a.quest.start.ways ?? []).filter((w) => !w.where && !/ in [A-Z]/.test(w.way)).map((w) => `A WAY WITH NO PLACE: ${w.way}`);
      return [a, ...placeless];
    },
    must: ["Balgruuf the Greater", "Dragonsreach", "Vignar Gray-Mane if the Stormcloaks hold Whiterun", /once you've helped people of the hold/i],
    never: [/"way":"It starts by itself when you enter Whiterun"/, /A WAY WITH NO PLACE/],
  },
];

interface Result {
  q: Question;
  pass: boolean;
  missing: string[];
  banned: string[];
  got: string;
}

async function answer(q: Question): Promise<Result> {
  const out = await q.ask();
  const json = JSON.stringify(out);
  const words = said(out);
  // A want with a quote in it reads the JSON (a field's value: '"then":"Retrieve Nettlebane"'); any other reads what the
  // assistant says from.
  const text = (w: Want) => ((typeof w === "string" ? w : w.source).includes('"') ? json : words);
  const missing = q.must.filter((w) => !has(text(w), w)).map(String);
  const banned = [...(q.never ?? []), ...NEVER].filter((w) => has(text(w), w)).map((w) => (typeof w === "string" ? w : `${w} ("${text(w).slice(Math.max(0, (text(w).match(w)?.index ?? 0) - 120), (text(w).match(w)?.index ?? 0) + 40)}")`));
  return { q, pass: !missing.length && !banned.length, missing, banned, got: words.replace(/\s+/g, " ").slice(0, 400) };
}

const results: Result[] = [];

describe("the player's questions (WO-135)", () => {
  for (const q of QUESTIONS) {
    const run = async () => {
      const r = await answer(q);
      results.push(r);
      expect({ missing: r.missing, banned: r.banned }).toEqual({ missing: [], banned: [] });
    };
    // A marked question is expected to fail: once it passes, this goes red, and the mark comes off.
    if (q.todo) it.fails(`${q.n}. ${q.asks} [fails today: ${q.todo}]`, run);
    else it(`${q.n}. ${q.asks}`, run);
  }
  afterAll(() => {
    if (!process.env.QUESTIONS) return;
    const lines = results
      .sort((a, b) => a.q.n - b.q.n)
      .map((r) => [`${r.pass ? "PASS" : "FAIL"}  ${r.q.n}. ${r.q.asks}`, ...(r.pass ? [] : [`      ${r.q.todo ? `marked: ${r.q.todo}` : "NOT MARKED: this one broke"}`, ...r.missing.map((m) => `      missing ${m}`), ...r.banned.map((b) => `      has ${b}`)]), `      got: ${r.got}`].join("\n"));
    console.log(`\n${lines.join("\n\n")}\n\n${results.filter((r) => r.pass).length} of ${results.length} pass.\n`);
  });
});
