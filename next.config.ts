import type { NextConfig } from "next";
import { itemsHashes } from "./src/lib/items/hash";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.discordapp.com" }],
  },
  // Each version's items.json hash, for the items URL: a rebuilt index is fetched at once.
  env: { NEXT_PUBLIC_ITEMS_HASHES: JSON.stringify(itemsHashes()) },
};

export default nextConfig;
