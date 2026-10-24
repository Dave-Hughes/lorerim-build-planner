import { describe, expect, it } from "vitest";
import { rules } from "./rules-view";
import { getQuest, styleGuide } from "./facts";
import { questsData } from "@/lib/quests/data";
import { promisedDestination, reviewRoutes, type RoutedAct } from "@/lib/playthroughs/route-review";
import { byStop } from "@/lib/playthroughs/view";
import { stopOn } from "@/lib/playthroughs/writes";
import { actSchema } from "@/lib/playthroughs/validate";

/** WO-129: an act with a thread. Routes and stops (Part 1), the rule (Parts 2 and 5), warnings (Part 3), rewards (Part 6). */

const missive = questsData().byId.get("missives")!.quests[0].edid;

/** A copy of Kyria's Act II, The Bard's Road, as Dave played it (21 Oct), before the chat session fixed it by hand. */
const actII: RoutedAct = {
  n: "II",
  route: [
    { place: "Riften", why: "She leaves Riften on foot, the long way." },
    { place: "Ivarstead", why: "Fastred's errand." },
    { place: "Riverwood", why: "On the road to Whiterun." },
    { place: "Whiterun", why: "Alessandra's dagger." },
    { place: "Markarth", why: "The Bards College sent her west." },
    { place: "Solitude", why: "The College itself." },
  ],
  objectives: [
    { id: 1, text: "Bring Fastred home to Ivarstead", why: "Asked by her parents in Ivarstead.", stop: "Ivarstead", link: null, detect: null },
    { id: 2, text: "Deliver Romlyn's mead to Wilhelm", why: null, stop: "Ivarstead", link: { kind: "quest", id: "FreeformRiften03" }, detect: { quest: "FreeformRiften03" } },
    { id: 3, text: "One missive from Whiterun's board, bound for Solitude", why: null, stop: "Whiterun", link: { kind: "quest", id: missive }, detect: null },
    { id: 4, text: "Catch the white horse", why: "In Whiterun's fields.", stop: "Whiterun", link: { kind: "quest", id: "0WRHorseQ" }, detect: null },
    { id: 5, text: "Clear Redoran's Retreat", why: "Her first bandits.", stop: null, link: null, detect: null },
  ],
};

describe("routes and stops (Part 1)", () => {
  it("an act takes a route of stops, each place once", () => {
    const ok = actSchema.safeParse({ name: "The Bard's Road", levels: "6 to 12", place: "Ivarstead", goal: "On foot.", route: actII.route });
    expect(ok.success).toBe(true);
    const twice = actSchema.safeParse({ name: "X", levels: "1", place: "", goal: "", route: [{ place: "Riften", why: "" }, { place: "riften", why: "" }] });
    expect(twice.success).toBe(false);
    expect(twice.error!.issues[0].message).toBe("riften is on the route twice. A stop is a place, once.");
  });

  it("an objective's stop is one of its act's stops, in the route's spelling; anything else is refused", () => {
    expect(stopOn(actII.route, "  whiterun ")).toBe("Whiterun");
    expect(stopOn(actII.route, null)).toBeNull();
    expect(() => stopOn(actII.route, "Dawnstar")).toThrow("Dawnstar isn't a stop on the act's route. Its stops are: Riften, Ivarstead, Riverwood, Whiterun, Markarth, Solitude.");
    expect(() => stopOn(null, "Whiterun")).toThrow(/The act has no route yet/);
  });

  it("Play lists objectives under their stops in route order, On the road last, empty stops left out", () => {
    const groups = byStop(actII.route, actII.objectives);
    expect(groups.map((g) => g.stop?.place ?? "On the road")).toEqual(["Ivarstead", "Whiterun", "On the road"]);
    expect(groups[1].objectives.map((o) => o.id)).toEqual([3, 4]);
    // No route: one group, no heading.
    expect(byStop(null, actII.objectives)).toEqual([{ stop: null, objectives: actII.objectives }]);
  });
});

describe("warnings on Kyria's Act II (Part 3)", () => {
  const w = reviewRoutes([actII]);
  const of = (id: number) => w.filter((x) => x.objective === String(id)).map((x) => x.code);

  it("Under the Table is a backtrack: it starts in Riften, which the route left at its first stop", () => {
    expect(w.find((x) => x.objective === "2")?.message).toBe(
      "Under the Table starts in Riften; the route left Riften at its first stop. Move it to an act set in Riften, or add the trip back with a reason.",
    );
  });

  it("the missive bound for Solitude is a promise the game doesn't make", () => {
    expect(of(3)).toEqual(["route-promise"]);
    expect(w.find((x) => x.objective === "3")!.message).toMatch(/^'One missive from Whiterun's board, bound for Solitude' says it goes to Solitude, but Missives jobs don't name where they go/);
  });

  it("an objective at no stop has no thread", () => {
    expect(of(5)).toEqual(["route-no-stop"]);
  });

  it("the objectives on the thread are clean", () => {
    expect(of(1)).toEqual([]);
    expect(of(4)).toEqual([]);
  });

  it("a board job before you leave, with no destination named, is no promise", () => {
    expect(promisedDestination("Before she leaves Whiterun for Markarth, check the board for a delivery bound there.")).toBeNull();
    expect(promisedDestination("A letter for Dawnstar")).toBe("Dawnstar");
    // A missive's note names its town on the board (the PC's read, Part 4), so looking for one bound there is real.
    expect(promisedDestination("Before she leaves Whiterun for Markarth, check the board for a delivery bound for Markarth.")).toBeNull();
  });

  it("a quest that starts in a town not on the route is said", () => {
    const off = reviewRoutes([{ ...actII, objectives: [{ id: 9, text: "Pilgrimage", why: null, stop: "Ivarstead", link: { kind: "quest", id: "FreeformRiften13" }, detect: null }] }]);
    expect(off[0].message).toBe("Pilgrimage starts in Falkreath, which isn't on Act II's route. Move it to an act that goes there, or add the stop with a reason.");
  });

  it("an act with no route gets no route warnings", () => {
    expect(reviewRoutes([{ ...actII, route: null }]).filter((x) => x.code !== "route-promise")).toEqual([]);
  });
});

describe("rewards that change play (Part 6)", () => {
  it("Running Wild returns its horse and saddle endings against the gold one, from the stage text", () => {
    const q = rules("Running Wild").quest as unknown as { changesTheRun: unknown[]; changesTheRunNote: string };
    expect(q.changesTheRun).toEqual([
      { gives: "a mount", atStage: 40, ending: "I went to Joslin. In exchange for letting her ride the horse, she made me an imperial saddle.", saidAt: { stage: 30, text: "If I go to Joslin, I will not get the reward in gold, but I will be able to keep the horse for myself." }, onlyThisEnding: true },
      { gives: "a mount", atStage: 41, ending: "I went to Joslin. In exchange for letting her ride the horse, she made me a nord saddle for it.", saidAt: { stage: 30, text: "If I go to Joslin, I will not get the reward in gold, but I will be able to keep the horse for myself." }, onlyThisEnding: true },
      { gives: "a lot of gold", atStage: 45, ending: "I went to Dragonsreach, and got paid in gold for the horse.", saidAt: { stage: 30, text: "If I go to Dragonsreach I will most likely be payed a handsome sum for the horse, but horse will go to the Jarl." }, onlyThisEnding: true },
    ]);
    expect(q.changesTheRunNote).toBe("An ending of Running Wild hands over a mount or a lot of gold, and the player chooses which ending. Say what that does to the character's run and ask the player before recommending it (rule 21).");
  });

  it("Missives carry no destination in their name (destinationInName false)", () => {
    expect(questsData().byId.get("missives")!.destinationInName).toBe(false);
  });
});

describe("the rule (Parts 2 and 5)", () => {
  it("rule 21 and its How to build line, word for word; Honesty from 22", () => {
    const g = styleGuide();
    expect(g).toMatch(/^21\. An act is a road with a reason\. Give it a route: its stops in order, each with why she goes there next\./m);
    expect(g).toContain("if an ending hands over a mount, a house, a follower or a lot of gold, say what that does to the character's run and ask the player.");
    expect(g).toContain("- Before writing an act's objectives, set its route (rule 21).");
    expect(g).toMatch(/^22\. A draft is a draft\./m);
  });
});
