import "server-only";
import { gameData, type GameData } from "@/lib/rules/data";
import { shippedVersions } from "@/lib/rules/versions";

/** The MCP tools' shared pieces (WO-108, WO-110): the default version and the refusal they throw. */

export const DEFAULT_VERSION = "5.0.4.8";

export class FactsError extends Error {}

/** The game data for `version`; any version the planner doesn't ship is refused, naming those it does. */
export function versionData(version: string = DEFAULT_VERSION): GameData {
  const shipped = shippedVersions().map((v) => v.id);
  const d = shipped.includes(version) ? gameData(version) : undefined;
  if (!d) throw new FactsError(`LoreRim ${version} isn't in the planner. It has: ${shipped.join(", ")}.`);
  return d;
}

