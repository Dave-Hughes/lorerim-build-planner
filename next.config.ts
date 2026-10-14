import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";
import { itemsHashes } from "./src/lib/items/hash";
import { readGuide } from "./src/lib/game-guide/guide";

// The guide's files are read once here (WO-66), so a broken one fails the build with its name and line.
readGuide();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.discordapp.com" }],
  },
  // Each version's items.json hash, for the items URL: a rebuilt index is fetched at once.
  env: { NEXT_PUBLIC_ITEMS_HASHES: JSON.stringify(itemsHashes()) },
  // The guide's words live in content/guide/*.md (WO-66): ship them with the pages that read them.
  outputFileTracingIncludes: { "/guide": ["./content/guide/**/*"], "/guide/[slug]": ["./content/guide/**/*"], "/guide/questions": ["./content/guide/**/*"], "/guide/mods": ["./content/guide/**/*"] },
  // The FAQ became the guide's All questions (WO-66).
  async redirects() {
    return [{ source: "/faq", destination: "/guide/questions", permanent: true }];
  },
};

// Vercel BotID (WO-40): its proxy rewrites, so ad-blockers don't get in the way of the check.
export default withBotId(nextConfig);
