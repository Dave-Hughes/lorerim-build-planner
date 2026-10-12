import { describe, expect, it } from "vitest";
import tips from "./tips.json";

// WO-38: the footer's loading-screen tips, word for word as ordered (each checked against the field guide).
const ORDERED = [
  "Any lit campfire is a place to rest, except a giant's.",
  "Swimming in icy water takes you straight to Numb. Get out and find a fire.",
  "Craft a waterskin at a tanning rack from one leather and one leather strip. Innkeepers refill it for free.",
  "Hot soups and stews warm you as well as feed you.",
  "A lit torch in hand is worth 50 warmth.",
  "You level up when you sleep. Survival Control Panel can change that.",
  "Carry weight doesn't grow with your level. Wayfarer perks and gear raise it.",
  "Arrows and lockpicks weigh nothing.",
  "You come back where you last slept or rested by a campfire.",
  "Shrines no longer cure diseases.",
  "Fast travel is off. Carriages cost 10 to 400 gold, by distance.",
  "You can't save in combat.",
  "Bounties are ten times what they were in vanilla Skyrim.",
  "F11 shows the hotkey list.",
];

describe("footer tips", () => {
  it("has the 14 tips, word for word", () => {
    expect(tips).toEqual(ORDERED);
  });
});
