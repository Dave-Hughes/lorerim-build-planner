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
  outputFileTracingIncludes: { "/guide": ["./content/guide/**/*"], "/guide/[slug]": ["./content/guide/**/*"], "/guide/questions": ["./content/guide/**/*"], "/guide/mods": ["./content/guide/**/*"], "/guide/terms": ["./content/guide/**/*"] },
  // The FAQ became the guide's All questions (WO-66).
  // Sign-in for assistants (WO-109): the OAuth metadata lives at /.well-known/, served from /oauth/metadata/.
  async rewrites() {
    return [
      { source: "/.well-known/oauth-authorization-server", destination: "/oauth/metadata/authorization-server" },
      { source: "/.well-known/oauth-authorization-server/:path*", destination: "/oauth/metadata/authorization-server" },
      { source: "/.well-known/oauth-protected-resource", destination: "/oauth/metadata/protected-resource" },
      { source: "/.well-known/oauth-protected-resource/:path*", destination: "/oauth/metadata/protected-resource/:path*" },
    ];
  },
  async redirects() {
    return [{ source: "/faq", destination: "/guide/questions", permanent: true }];
  },
};

// Vercel BotID (WO-40): its proxy rewrites, so ad-blockers don't get in the way of the check.
export default withBotId(nextConfig);
