/**
 * A throwaway second LoreRim version for tests only: 5.0.4.8 without the
 * Bulwark trait, registered as an older version. Never shipped: the app only
 * registers it when PLANNER_TEST_VERSIONS=1 (the e2e server), see ../server.ts.
 */
import { registerVersion, versionSource } from "../versions";

export const TEST_VERSION_ID = "0.0.0-test";
/** The trait the test version doesn't have. */
export const TEST_VERSION_MISSING_TRAIT = "Bulwark";

export function registerTestVersion(): void {
  const base = versionSource("5.0.4.8")!;
  registerVersion(
    { id: TEST_VERSION_ID, label: `LoreRim ${TEST_VERSION_ID}` },
    { ...base, traits: base.traits.filter((t) => t.name !== TEST_VERSION_MISSING_TRAIT) },
  );
}
