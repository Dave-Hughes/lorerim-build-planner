import type { Metadata } from "next";
import { GameDataProvider } from "@/components/game-data";
import { ComingSoon } from "@/components/coming-soon/coming-soon";
import { clientVersion, currentVersion } from "@/lib/rules/server";

// The site's share card comes from the root layout (/og).
export const metadata: Metadata = {
  title: { absolute: "LoreRim Build Planner" },
  description: "A build planner for LoreRim. Plan a character, see what changes at each level and share it.",
};

/**
 * The coming soon page (WO-84). With FEATURE_COMING_SOON on, the proxy shows it in place of every
 * page (src/proxy.ts); it can be opened here directly too. Iriel's tree uses the current game data.
 */
export default function ComingSoonPage() {
  const v = currentVersion().id;
  return (
    <GameDataProvider version={v} serverVersion={clientVersion(v)}>
      <ComingSoon />
    </GameDataProvider>
  );
}
