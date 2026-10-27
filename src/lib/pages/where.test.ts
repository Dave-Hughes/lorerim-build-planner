import { describe, expect, it } from "vitest";
import { placeOnly, vaguePlace } from "./where";

describe("placeOnly", () => {
  it("keeps the place and drops the hours", () => {
    expect(placeOnly("Wilhelm's Winter Wares, his shop and warehouse in the Windhelm market; on Morndas he works at the Battle-Brew Meadery from 8 am to 8 pm instead")).toBe("Wilhelm's Winter Wares, his shop and warehouse in the Windhelm market");
    expect(placeOnly("The Hag's Cure in Markarth (her shop, 8 am to 8 pm; she sleeps there too)")).toBe("The Hag's Cure in Markarth");
    expect(placeOnly("the Riften Fishery by day; Bolli's House early morning")).toBe("the Riften Fishery");
    expect(placeOnly("inside Castle Dour, in Solitude, from 6 in the morning; from about 7 to 11 at night she walks the city")).toBe("Castle Dour, in Solitude");
    expect(placeOnly("Sarethi Farm in the Rift, working the fields by day and in the farmhouse at night")).toBe("Sarethi Farm in the Rift");
    expect(placeOnly("Jorrvaskr, Whiterun. Skjor eats in the main hall from 10 am to 1 pm")).toBe("Jorrvaskr, Whiterun");
    expect(placeOnly("Moss Mother Cavern near Falkreath at first; once his own trouble there is over")).toBe("Moss Mother Cavern near Falkreath");
  });
  it("leaves a plain place as it is, and says nothing for nothing", () => {
    expect(placeOnly("Mistveil Keep in Riften")).toBe("Mistveil Keep in Riften");
    expect(placeOnly("the Dark Brotherhood Sanctuary, near Falkreath")).toBe("the Dark Brotherhood Sanctuary, near Falkreath");
    expect(placeOnly(undefined)).toBeUndefined();
    expect(placeOnly("   ")).toBeUndefined();
  });
});

describe("vaguePlace", () => {
  it("catches a place that isn't one", () => {
    expect(vaguePlace("wherever the long-dead lovers are")).toBe(true);
    expect(vaguePlace("somewhere in Skyrim")).toBe(true);
    expect(vaguePlace("Mistveil Keep in Riften")).toBe(false);
  });
});
