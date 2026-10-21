/**
 * WO-122: character creation through the door is checked as Set up checks it. A creation Set up would
 * still ask about is refused with the choices named, and nothing is saved.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

const from = ip();
const nord = { race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech", "One-Handed", "Alchemy", "Wayfarer"] };

test("a creation with 2 minors, a trait without its choice or a start without its option is refused with the choices", async ({ page, context, baseURL }) => {
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (args: object) => call(baseURL!, from, t.access_token, "create_build", { name: "E2E Unfinished", ...nord, start: "Regular (Inn)", startOption: "Random", ...args });

  const two = await go({ minors: ["Block", "Restoration"] });
  expect(two.isError).toBe(true);
  expect(two.text).toBe("Nothing was saved. Character creation: Choose 4 more minor skills (6 in all).");

  const fatal = await go({ traits: ["Fatal Attraction"] });
  expect(fatal.text).toBe("Nothing was saved. Character creation: Fatal Attraction needs a choice: Male or Female.");

  const pilgrim = await go({ start: "Pilgrim (Temple)", startOption: undefined });
  expect(pilgrim.text).toBe(
    "Nothing was saved. Character creation: Pilgrim (Temple) needs a temple: Random, Temple of the Divines, Temple of Dibella, Temple of Kynareth, Temple of Mara or Temple of Talos.",
  );

  const listed = (await call(baseURL!, from, t.access_token, "list_my_builds", {})).json();
  expect(listed.filter((b: { name: string }) => b.name === "E2E Unfinished")).toHaveLength(0);
});
