import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { deityIconFile } from "@/components/ui/skill-icon";
import { requireGameData } from "./data";

describe("deities", () => {
  const d = requireGameData("5.0.4.8");
  it("are all 55 of Wintersun's, with their text", () => {
    expect(Object.keys(d.deityText)).toHaveLength(55);
    expect(d.deities).toHaveLength(55);
    expect(d.deities).toEqual(expect.arrayContaining(["The All-Maker", "The Old Ways", "Hermaeus Mora", "St. Alessia", "The HoonDing", "Riddle'Thar", "Z'en"]));
  });

  it("each have an icon", () => {
    for (const name of d.deities) expect(existsSync(`public/icons/${deityIconFile(name)}.svg`), name).toBe(true);
  });
});
