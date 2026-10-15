import type { Metadata } from "next";
import { Jersey_10 } from "next/font/google";
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
// The hero title and "Opening soon" only (design rules: the coming soon page's one exception).
const pixel = Jersey_10({ subsets: ["latin"], weight: "400", variable: "--font-pixel" });

export default function ComingSoonPage() {
  const v = currentVersion().id;
  return (
    <GameDataProvider version={v} serverVersion={clientVersion(v)}>
      <div className={pixel.variable}>
        <ComingSoon />
      </div>
    </GameDataProvider>
  );
}
