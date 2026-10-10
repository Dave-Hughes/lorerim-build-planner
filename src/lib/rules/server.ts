/**
 * Version data on the server. Import from server code only (pages, server
 * actions, validation): it is where the test-only fixture version gets
 * registered, so the fixture never reaches the browser bundle.
 */
import { registerTestVersion } from "./__fixtures__/test-version";
import { isShippedVersion, versionInfo, versionSource } from "./versions";
import type { GameVersion } from "./versions";
import type { VersionSource } from "./data";

if (process.env.PLANNER_TEST_VERSIONS === "1") registerTestVersion();

/**
 * What a client component needs to load a build's version: nothing for a shipped version
 * (its data is in the bundle), the version and its data for one the server alone knows.
 */
export function clientVersion(id: string): { meta: GameVersion; source: VersionSource } | null {
  if (isShippedVersion(id)) return null;
  const meta = versionInfo(id);
  const source = versionSource(id);
  return meta && source ? { meta, source } : null;
}

export { gameData, requireGameData, type GameData } from "./data";
export { currentVersion, isKnownVersion, isOlderThanCurrent, knownVersions, shippedVersions, versionInfo } from "./versions";
