import { describe, expect, it } from "vitest";
import { questsData } from "./data";
import { BRANCH_JOINER, pageOf } from "./reads";

/** WO-180 Part 7b: a branch joiner is never a numbered step. */
describe("branch joiners", () => {
  it("matches what a branch says to go back to the main line", () => {
    for (const t of ["Then as the main branch", "Then as the main branch.", "Continue as the main branch", "As the main branch"]) expect(BRANCH_JOINER.test(t), t).toBe(true);
    for (const t of ["Talk to Remi.", "Kill Nimhe.", "Follow the main road to Whiterun"]) expect(BRANCH_JOINER.test(t), t).toBe(false);
  });
  it("is said under the branch's steps on The Dwemer Specialist, and is nobody's step anywhere", () => {
    const q = questsData().lines.flatMap((l) => l.quests).find((x) => /Dwemer Specialist/.test(x.name))!;
    const branch = pageOf(q).steps.find((s) => s.branch === "You had already killed Nimhe")!;
    expect(branch.then).toBe("Then as the main branch");
    expect(branch.objectives).toEqual(["Read the note by the guard's body (the Calcelmo and spider steps are skipped)"]);
    for (const l of questsData().lines) for (const x of l.quests) for (const s of pageOf(x).steps) for (const o of s.objectives) expect(BRANCH_JOINER.test(o.trim()), `${x.name}: ${o}`).toBe(false);
  });
});
