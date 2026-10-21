import { beforeEach, describe, expect, it, vi } from "vitest";
import { schema } from "@/db";

/**
 * WO-114: one character, two views. A stand-in database records each statement and batch, so the
 * tests can see what is written together and what is never written.
 */

type Op = { kind: string; table: unknown; values?: unknown; set?: unknown };
const batches: Op[][] = [];
const singles: Op[] = [];
let rows: unknown[] = [];

function chain(kind: string, table?: unknown) {
  const op: Op = { kind, table };
  const c = {
    op,
    values(v: unknown) {
      op.values = v;
      return c;
    },
    set(v: unknown) {
      op.set = v;
      return c;
    },
    from: () => c,
    where: () => c,
    limit: () => c,
    orderBy: () => c,
    returning: () => c,
    then(resolve: (v: unknown) => void) {
      if (kind !== "select") singles.push(op);
      resolve(kind === "select" ? rows : []);
    },
  };
  return c;
}
const fake = {
  insert: (t: unknown) => chain("insert", t),
  update: (t: unknown) => chain("update", t),
  delete: (t: unknown) => chain("delete", t),
  select: () => chain("select"),
  batch: vi.fn(async (items: { op: Op }[]) => {
    batches.push(items.map((i) => i.op));
    return [];
  }),
};
vi.mock("@/db", async (orig) => ({ ...(await orig<typeof import("@/db")>()), db: () => fake }));

const { insertBuild } = await import("@/lib/builds/writes");
const { prepareRun, runStatements, storyMoveStatements, PlaythroughError } = await import("./writes");
const { runOfBuild } = await import("./queries");
const { taleSchema } = await import("./validate");

beforeEach(() => {
  batches.length = 0;
  singles.length = 0;
  rows = [];
});

const details = { name: "Kyria", description: "A knight.", coverImageUrl: "", writeupUrl: "", visibility: "private" as const, tags: null };
const plan = { gameVersion: "5.0.4.8" } as never;

describe("a character made in one pass", () => {
  it("writes the build, the run, Act I, its objectives and the first save in one batch", async () => {
    const run = prepareRun({ name: "Kyria Severa", line: "A knight.", act: { name: "The first days", levels: "1 to 5", place: "Riften", goal: "" }, objectives: [{ text: "Unbound", kind: "once", doneBy: "save", detect: { quest: "MQ101" } }] });
    let runId = "";
    const buildId = await insertBuild("u1", details, plan, null, (b) => {
      const r = runStatements("u1", b, "5.0.4.8", run, null);
      runId = r.id;
      return r.statements;
    });
    expect(singles).toHaveLength(0);
    expect(batches).toHaveLength(1);
    const tables = batches[0].map((o) => o.table);
    // The build's first save goes in its history in the same batch (WO-122).
    expect(tables).toEqual([schema.builds, schema.playthroughs, schema.playthroughActs, schema.playthroughObjectives, schema.buildRevisions]);
    expect(batches[0][1].values).toMatchObject({ id: runId, buildId, name: "Kyria Severa" });
    expect(batches[0][2].values).toMatchObject({ playthroughId: runId, position: 1, name: "The first days", levelFrom: 1, levelTo: 5 });
  });
  it("writes nothing when the run's step is refused", () => {
    expect(() => prepareRun({ name: "Kyria", act: { name: "The first days", levels: "soon", place: "", goal: "" } })).toThrow(PlaythroughError);
    expect(() => prepareRun({ name: "Kyria", act: { name: "I", levels: "1 to 5", place: "", goal: "" }, objectives: [{ text: "Read every new book", kind: "once", doneBy: "hand" }] })).toThrow(/Objective 1/);
    expect(batches).toHaveLength(0);
    expect(singles).toHaveLength(0);
  });
});

describe("one tale per character", () => {
  it("moves a build's Story to the run's first chapter on attach, images kept", async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_abc123_secret";
    const image = "https://abc123.public.blob.vercel-storage.com/dev/builds/e2estry333/plate01abcd.png";
    const story = { type: "doc", content: [{ type: "image", attrs: { src: image, caption: "The chapel" } }, { type: "paragraph", content: [{ type: "text", text: "She swept the floors." }] }] };
    rows = [
      { key: "story", doc: story },
      { key: "story:title", doc: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Sword of Stendarr" }] }] } },
    ];
    const st = (await storyMoveStatements("e2estry333", "run1")) as unknown as { op: Op }[];
    const ops = st.map((s) => s.op);
    expect(ops.map((o) => o.kind)).toEqual(["insert", "update", "delete"]);
    expect(ops[0].table).toBe(schema.playthroughChapters);
    expect(ops[0].values).toMatchObject({ playthroughId: "run1", kind: "chapter", position: 0, title: "Sword of Stendarr", actId: null });
    expect(JSON.stringify((ops[0].values as { doc: unknown }).doc)).toContain(image);
    expect(JSON.stringify((ops[0].values as { doc: unknown }).doc)).toContain("The chapel");
    expect(ops[2].table).toBe(schema.buildGuides);
  });
  it("moves nothing from a build with no Story", async () => {
    rows = [];
    expect(await storyMoveStatements("b", "run1")).toEqual([]);
  });
});

describe("the build page's run line", () => {
  it("shows a private run to its owner only, a Link only or Listed run to anyone", async () => {
    rows = [{ id: "run1", name: "Kyria Severa", ownerId: "u1", visibility: "private" }];
    expect(await runOfBuild("b", "u1")).toMatchObject({ id: "run1" });
    expect(await runOfBuild("b", "u2")).toBeNull();
    expect(await runOfBuild("b", null)).toBeNull();
    rows = [{ id: "run1", name: "Kyria Severa", ownerId: "u1", visibility: "unlisted" }];
    expect(await runOfBuild("b", "u2")).toMatchObject({ id: "run1" });
    rows = [];
    expect(await runOfBuild("b", "u1")).toBeNull();
  });
});

describe("the Tale's title and epigraph", () => {
  it("takes a title of 60 and a line of 140, empty for none", () => {
    expect(taleSchema.safeParse({ taleTitle: "Sword of Stendarr", taleLine: "What is beautiful? What is made with care." }).success).toBe(true);
    expect(taleSchema.safeParse({ taleTitle: "", taleLine: "" }).success).toBe(true);
    expect(taleSchema.safeParse({ taleTitle: "x".repeat(61) }).success).toBe(false);
    expect(taleSchema.safeParse({ taleLine: "x".repeat(141) }).success).toBe(false);
  });
});
