import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ART_FILES } from "./art";

describe("WO-87: the coming soon page's pixel art", () => {
  it("every px/ image the page asks for exists", () => {
    expect(ART_FILES.length).toBeGreaterThan(20);
    for (const f of new Set(ART_FILES)) expect(existsSync(join(process.cwd(), "public", f)), f).toBe(true);
  });

  it("nothing asks for a shot-* file, and none are left", () => {
    const page = readFileSync(join(process.cwd(), "src/components/coming-soon/coming-soon.tsx"), "utf8");
    expect(page).not.toMatch(/shot-\d/);
    expect(ART_FILES.some((f) => f.includes("shot-"))).toBe(false);
    for (const n of ["864", "868", "855", "869", "860", "782"]) expect(existsSync(join(process.cwd(), `public/coming-soon/shot-${n}.webp`))).toBe(false);
  });
});
