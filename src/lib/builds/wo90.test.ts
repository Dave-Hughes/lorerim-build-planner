import { afterEach, describe, expect, it, vi } from "vitest";
import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { lineDoc, type GuideDoc } from "@/lib/guide/doc";
import { coverPrefix, imagePrefix } from "@/lib/guide/images";
import type { BuildPlan } from "@/lib/rules/types";
import { exportBuild, exportFileName, moveImages, parseImport, rewriteImages } from "./transfer";

const plan = sample as unknown as BuildPlan;
const KNOWN = new Set(["stealth", "archery", "two-handed"]);
const image = (src: string): GuideDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Before." }] }, { type: "image", attrs: { src, alt: "" } }] }) as GuideDoc;

function file(over: Partial<Parameters<typeof exportBuild>[0]> = {}) {
  return JSON.parse(
    JSON.stringify(
      exportBuild({
        name: "Iriel Thornwhisper",
        description: "Green Pact hunter.",
        gameVersion: plan.gameVersion,
        visibility: "public",
        coverImageUrl: "https://store.example/staging/covers/u1/cover.webp",
        plan,
        tags: ["stealth", "archery"],
        guides: [
          { key: "overview", doc: image("https://abc123.public.blob.vercel-storage.com/staging/builds/abcdefghjk/onefile12.webp") },
          { key: "level:3", doc: lineDoc("Take the bow from the Bannered Mare.") },
        ],
        ...over,
      }),
    ),
  );
}

describe("export and import (WO-90)", () => {
  it("round-trips the plan, the tags and the guides, and leaves out owner, ids, likes and dates", () => {
    const f = file();
    expect(f.format).toBe(1);
    for (const k of ["id", "ownerId", "likeCount", "featuredAt", "createdAt", "updatedAt"]) expect(f).not.toHaveProperty(k);
    const r = parseImport(f, KNOWN);
    if (!r.ok) throw new Error(r.error);
    expect(r.value.plan.levels).toEqual(plan.levels);
    expect(r.value.plan.notes).toEqual(plan.notes);
    expect(r.value.tags).toEqual(["stealth", "archery"]);
    expect(r.value.droppedTags).toEqual([]);
    expect(r.value.guides.map((g) => g.key)).toEqual(["overview", "level:3"]);
    expect(r.value.guides[1].doc).toEqual(lineDoc("Take the bow from the Bannered Mare."));
    expect(r.value.name).toBe("Iriel Thornwhisper");
    expect(r.value.visibility).toBe("public");
  });

  it("drops tags this planner doesn't have, and says which", () => {
    const r = parseImport(file({ tags: ["stealth", "made-up", "stealth"] }), KNOWN);
    if (!r.ok) throw new Error(r.error);
    expect(r.value.tags).toEqual(["stealth"]);
    expect(r.value.droppedTags).toEqual(["made-up"]);
  });

  it("refuses a bad plan with the reason", () => {
    const r = parseImport(file({ plan: { ...plan, gameVersion: "9.9.9" } }), KNOWN);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/^The build's plan didn't pass validation: .*Unknown LoreRim version/);
  });

  it("refuses an unknown guide section and a file that isn't an export", () => {
    const bad = file();
    bad.guides.push({ key: "appendix", doc: lineDoc("x") });
    expect(parseImport(bad, KNOWN)).toMatchObject({ ok: false, error: 'Unknown guide section "appendix".' });
    expect(parseImport({ ...file(), format: 2 }, KNOWN)).toMatchObject({ ok: false });
  });

  it("names the file after the build", () => {
    expect(exportFileName('Iriel: "Green" Pact/Hunter')).toBe("Iriel Green Pact Hunter.lorerim-build.json");
  });
});

describe("imported images (WO-90)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("rewrites the cover and guide images to this environment's prefixes, and leaves out one that can't be copied", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const r = parseImport(file({ guides: [{ key: "overview", doc: { type: "doc", content: [...image("https://abc123.public.blob.vercel-storage.com/staging/builds/abcdefghjk/onefile12.webp").content!, { type: "image", attrs: { src: "https://abc123.public.blob.vercel-storage.com/staging/builds/abcdefghjk/gonefile2.webp", alt: "" } }] } as GuideDoc }] }), KNOWN);
    if (!r.ok) throw new Error(r.error);
    const copied: string[] = [];
    const { cover, moved, skipped } = await moveImages(r.value, { cover: coverPrefix("admin-1"), guide: imagePrefix("newbuild22") }, async (url, prefix) => {
      if (url.includes("gonefile2")) return null;
      copied.push(prefix);
      return `https://store.example/${prefix}${url.split("/").pop()}`;
    });
    expect(cover).toBe("https://store.example/production/covers/admin-1/cover.webp");
    expect(copied).toEqual(["production/covers/admin-1/", "production/builds/newbuild22/"]);
    expect(skipped).toEqual(["https://abc123.public.blob.vercel-storage.com/staging/builds/abcdefghjk/gonefile2.webp"]);
    const doc = rewriteImages(r.value.guides[0].doc, moved);
    const srcs = JSON.stringify(doc).match(/"src":"[^"]+"/g);
    expect(srcs).toEqual(['"src":"https://store.example/production/builds/newbuild22/onefile12.webp"']);
    expect(JSON.stringify(doc)).toContain("Before.");
  });

  it("uses staging and dev prefixes off production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(imagePrefix("b")).toBe("staging/builds/b/");
    vi.stubEnv("VERCEL_ENV", "");
    expect(coverPrefix("u")).toBe("dev/covers/u/");
  });
});
