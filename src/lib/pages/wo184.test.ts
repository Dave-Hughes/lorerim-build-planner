import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cleanUnsure } from "./unsure";
import { gapCatalog } from "@/lib/gaps/catalog";
import { personUnsure, peopleData } from "@/lib/people/data";
import { placeUnsure } from "@/lib/places/unsure";
import { placesData } from "@/lib/places/data";
import { SHOT_WORDS, noShotYet, shotCaption, checkWords } from "@/lib/screenshots/words";
import { TIP_WORDS, howWords, tipStatusWords, HOW_OPTIONS } from "@/lib/tips/words";

/** WO-184: they are screenshots, never pictures or images, in every word a player reads. */
describe("what a player reads about screenshots", () => {
  const words = [...Object.values(SHOT_WORDS), noShotYet("Neloth"), shotCaption("Tapps"), checkWords("passed"), checkWords("listed"), checkWords("unchecked"), ...Object.values(TIP_WORDS), ...HOW_OPTIONS.map((h) => h.label), howWords("game"), tipStatusWords("approved")];
  it("the word lists have no picture or image", () => {
    for (const w of words) expect(w, w).not.toMatch(/\b(pictures?|images?)\b/i);
  });
  it("the components' text has none either", () => {
    const files = ["src/components/screenshots/shot-gallery.tsx", "src/components/screenshots/person-shots.tsx", "src/components/pages/report-mistake.tsx", "src/components/pages/not-sure.tsx", "src/components/account/sent.tsx", "src/components/admin/review-cards.tsx", "src/components/home/confirmed.tsx", "src/app/(site)/help-fill-the-gaps/page.tsx"];
    for (const f of files) {
      const src = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      // JSX text between tags, and double-quoted or backticked strings that are not attributes of the code (paths, types, class names).
      const text = [...src.matchAll(/>([^<>{}]*[A-Za-z][^<>{}]*)</g)].map((m) => m[1]);
      const strings = [...src.matchAll(/(?<![\w-])"([^"\n]*\s[^"\n]*)"/g)].map((m) => m[1]).filter((t) => !/^(image\/|\/|@|use )/.test(t));
      for (const t of [...text, ...strings]) expect(t, `${f}: ${t}`).not.toMatch(/\b(pictures?|images?)\b/i);
    }
  });
});

describe("Help fill the gaps lists what the pages list", () => {
  const catalog = gapCatalog();
  it("has quests, people and places, each with something missing", () => {
    for (const k of ["quest", "person", "place"] as const) expect(catalog.filter((g) => g.kind === k).length).toBeGreaterThan(20);
    for (const g of catalog) expect(g.missing.length, g.name).toBeGreaterThan(0);
  });
  it("says a place's lines exactly as its page does", () => {
    for (const p of placesData().places.slice(0, 400)) {
      const { fields } = cleanUnsure(placeUnsure(p));
      if (!fields.length) continue;
      expect(catalog.some((g) => g.kind === "place" && JSON.stringify(g.missing) === JSON.stringify(fields)), p.name).toBe(true);
    }
  });
  it("says a person's lines exactly as their page does, and never a field key or a record", () => {
    for (const person of peopleData().all.slice(0, 300)) {
      const { fields } = cleanUnsure(personUnsure(person));
      const g = catalog.find((x) => x.kind === "person" && x.key === person.slug);
      if (!fields.length) expect(g, person.name).toBeUndefined();
      else expect(g?.missing, person.name).toEqual(fields);
    }
    for (const g of catalog) for (const m of g.missing) expect(m, `${g.name}: ${m}`).not.toMatch(/[a-z]+[A-Z]|\.esp|\.esm|\b[A-Z]{2,}\d/);
  });
});
