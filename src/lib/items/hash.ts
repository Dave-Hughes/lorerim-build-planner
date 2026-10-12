/**
 * A short hash of a version's items.json, put in the items URL at build time
 * (`/api/items/5.0.4.8?v=<hash>`), so a rebuilt index is fetched at once while the long cache stays.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export function itemsHash(contents: string): string {
  return createHash("sha256").update(contents).digest("hex").slice(0, 12);
}

/** Every version's hash, by version id, from src/data/lorerim-<version>/items.json. */
export function itemsHashes(root = process.cwd()): Record<string, string> {
  const data = path.join(root, "src", "data");
  const out: Record<string, string> = {};
  for (const dir of readdirSync(data)) {
    const m = /^lorerim-(.+)$/.exec(dir);
    const file = path.join(data, dir, "items.json");
    if (m && existsSync(file)) out[m[1]] = itemsHash(readFileSync(file, "utf8"));
  }
  return out;
}
