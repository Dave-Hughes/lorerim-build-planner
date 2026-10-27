import { describe, expect, it } from "vitest";
import { linkNames } from "./link-names";

const names = [
  { text: "Deeja", href: "/people/deeja" },
  { text: "Broken Oar Grotto", href: "/places/broken-oar-grotto" },
  { text: "Broken Oar", href: "/places/broken-oar" },
];

describe("linkNames", () => {
  it("links each name once where it stands and keeps the words between", () => {
    expect(linkNames("Meet Deeja at Broken Oar Grotto, then leave.", names)).toEqual([
      { text: "Meet " },
      { text: "Deeja", href: "/people/deeja" },
      { text: " at " },
      { text: "Broken Oar Grotto", href: "/places/broken-oar-grotto" },
      { text: ", then leave." },
    ]);
  });
  it("takes the longest name, and never a name inside a longer word", () => {
    expect(linkNames("Deejas and the Deejaa", names)).toEqual([{ text: "Deejas and the Deejaa" }]);
    expect(linkNames("Broken Oar Grotto", names)).toEqual([{ text: "Broken Oar Grotto", href: "/places/broken-oar-grotto" }]);
    expect(linkNames("Broken Oar", names)[0]).toEqual({ text: "Broken Oar", href: "/places/broken-oar" });
  });
  it("says a name with a regular-expression character as plain text", () => {
    expect(linkNames("Ask Mr. (Dave) now", [{ text: "Mr. (Dave)", href: "/people/dave" }])[1]).toEqual({ text: "Mr. (Dave)", href: "/people/dave" });
  });
  it("is the text whole when there is nothing to link", () => {
    expect(linkNames("Nothing here", [])).toEqual([{ text: "Nothing here" }]);
    expect(linkNames("", names)).toEqual([{ text: "" }]);
  });
});
