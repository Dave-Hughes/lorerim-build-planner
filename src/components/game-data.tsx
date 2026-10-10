"use client";

import { createContext, useContext } from "react";
import { gameData, type GameData, type VersionSource } from "@/lib/rules/data";
import { registerVersion, type GameVersion } from "@/lib/rules/versions";

const GameDataContext = createContext<GameData | null>(null);

/**
 * Gives client components the data of one LoreRim version: the build's own, set at the
 * page level from `plan.gameVersion`. `serverVersion` carries the data of a version the
 * browser bundle doesn't ship (see `clientVersion` in lib/rules/server.ts).
 */
export function GameDataProvider({
  version,
  serverVersion,
  children,
}: {
  version: string;
  serverVersion?: { meta: GameVersion; source: VersionSource } | null;
  children: React.ReactNode;
}) {
  if (serverVersion) registerVersion(serverVersion.meta, serverVersion.source);
  return <GameDataContext.Provider value={gameData(version) ?? null}>{children}</GameDataContext.Provider>;
}

/** The data of the build's LoreRim version. Only valid under a GameDataProvider for a known version. */
export function useGameData(): GameData {
  const d = useContext(GameDataContext);
  if (!d) throw new Error("useGameData needs a GameDataProvider for a known LoreRim version.");
  return d;
}
