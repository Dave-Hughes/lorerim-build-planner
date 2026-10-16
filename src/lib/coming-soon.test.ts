import { describe, expect, it } from "vitest";
import { comingSoonOn, passesComingSoon } from "./coming-soon";

describe("WO-84: the coming soon switch", () => {
  it("is off when unset, under next dev too", () => {
    expect(comingSoonOn({})).toBe(false);
    expect(comingSoonOn({ NODE_ENV: "development" })).toBe(false);
    expect(comingSoonOn({ NODE_ENV: "production", FEATURE_COMING_SOON: "" })).toBe(false);
    expect(comingSoonOn({ FEATURE_COMING_SOON: "off" })).toBe(false);
  });

  it("is on only when set on", () => {
    expect(comingSoonOn({ FEATURE_COMING_SOON: "on" })).toBe(true);
    expect(comingSoonOn({ FEATURE_COMING_SOON: " ON " })).toBe(true);
    expect(comingSoonOn({ FEATURE_COMING_SOON: "1" })).toBe(true);
  });

  it("lets sign-in, the site's share card, the API and files through; every page and every build's card shows it", () => {
    for (const p of ["/signin", "/api/auth/providers", "/og/site.png", "/icon.svg", "/icons/logo-0.svg", "/coming-soon/shot-864.webp", "/_next/static/x.js"]) expect(passesComingSoon(p), p).toBe(true);
    for (const p of ["/", "/b/e2eyrye7q2", "/b/e2eyrye7q2/card.png", "/b/sample/card.png", "/b/e2eyrye7q2/edit", "/new", "/guide", "/u/tapps", "/me"]) expect(passesComingSoon(p), p).toBe(false);
  });
});
