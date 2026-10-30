import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * WO-167: the map's author allowed it on one condition: every place it appears carries a credit and link to the mod. The map is drawn in one
 * component, which draws the credit from maps.json beside it; nothing else may load the map's pictures. This fails the build if either stops being so.
 */
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(path.join(dir, f)).isDirectory() ? walk(path.join(dir, f)) : [path.join(dir, f)]));
const src = walk(path.join(process.cwd(), "src")).filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts"));

describe("the map's credit", () => {
  it("is drawn by the one component that draws the map, with its link in a new tab", () => {
    const view = readFileSync(path.join(process.cwd(), "src/components/places/map-view.tsx"), "utf8");
    expect(view).toMatch(/entry\.credit\.url/);
    expect(view).toMatch(/entry\.credit\.text/);
    expect(view).toMatch(/target="_blank"/);
    expect(view).toMatch(/Map: /);
  });

  it("is drawn by every component that loads the map's pictures: the band and whole map, the Map page, the home page's map strip and an act's map", () => {
    const users = src.filter((f) => /entry\.(tiles|image)\b|\/maps\/tamriel/.test(readFileSync(f, "utf8"))).map((f) => path.relative(process.cwd(), f).split(path.sep).join("/"));
    expect(users.sort()).toEqual(["src/components/home/map-strip.tsx", "src/components/map/map-page.tsx", "src/components/places/map-view.tsx", "src/components/playthrough/act-map.tsx"]);
    for (const f of users) {
      const text = readFileSync(path.join(process.cwd(), f), "utf8");
      expect(text, f).toMatch(/entry\.credit\.url/);
      expect(text, f).toMatch(/entry\.credit\.text/);
      expect(text, f).toMatch(/target="_blank"/);
      expect(text, f).toMatch(/Map: /);
    }
  });

  it("is in maps.json with the mod's page", () => {
    const m = JSON.parse(readFileSync(path.join(process.cwd(), "src/data/lorerim-5.0.4.8/maps.json"), "utf8"));
    expect(m.Tamriel.credit).toEqual({ text: "Skyrim Paper Map by Caro Tuts", url: "https://www.nexusmods.com/skyrimspecialedition/mods/62705" });
  });
});
