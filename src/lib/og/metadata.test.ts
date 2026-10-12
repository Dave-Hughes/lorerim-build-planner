import { describe, expect, it } from "vitest";
import { buildMetadata, SITE_NAME } from "./metadata";

const build = {
  id: "e2eyrye7q2",
  name: "Secret Shadow Archer",
  description: "Hidden away until it's ready.",
  visibility: "private" as const,
  updatedAt: new Date("2026-10-11T20:00:00Z"),
  gameVersion: "5.0.4.8",
  author: { name: "Tapps" },
};

describe("link preview metadata", () => {
  it("says nothing about a private build: no name, description or cover", () => {
    const text = JSON.stringify(buildMetadata(build));
    expect(text).not.toContain("Secret Shadow Archer");
    expect(text).not.toContain("Hidden away");
    expect(text).not.toContain("card.png");
    expect(text).not.toContain("Tapps");
    expect(buildMetadata(build).title).toEqual({ absolute: SITE_NAME });
  });

  it("gives a listed or link-only build its own card, whose URL changes with each edit", () => {
    for (const visibility of ["public", "unlisted"] as const) {
      const m = buildMetadata({ ...build, visibility });
      const images = m.openGraph?.images as { url: string; width: number; height: number }[];
      expect(images[0]).toMatchObject({ url: `/b/e2eyrye7q2/card.png?v=${build.updatedAt.getTime()}`, width: 1200, height: 630 });
      expect(m.title).toBe("Secret Shadow Archer");
    }
  });
});
