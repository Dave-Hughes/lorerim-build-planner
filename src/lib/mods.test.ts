import { describe, expect, it } from "vitest";
import { shortModName } from "./mods";

describe("shortModName", () => {
  it("drops the subtitle after a dash and keeps a name that has none", () => {
    expect(shortModName("The Gray Cowl of Nocturnal - 10th anniversary")).toBe("The Gray Cowl of Nocturnal");
    expect(shortModName("Follower Dialogue Expansion - Faralda")).toBe("Follower Dialogue Expansion");
    expect(shortModName("Missives")).toBe("Missives");
    expect(shortModName("Fists of Fury - Skyrim")).toBe("Fists of Fury");
    expect(shortModName("Remiel-Custom Voiced Follower")).toBe("Remiel-Custom Voiced Follower");
  });
});
