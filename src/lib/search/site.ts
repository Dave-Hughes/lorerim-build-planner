import "server-only";
import { searchBuilds } from "@/lib/builds/queries";
import { siteGuideOn } from "@/lib/features";
import { readGuide } from "@/lib/game-guide/guide";
import { searchEverything, type Found } from "./everything";
import { fuzzyScore, words } from "./fuzzy";

export type Hit = Found;
export interface SiteResults {
  quests: Hit[];
  people: Hit[];
  places: Hit[];
  builds: Hit[];
  guide: Hit[];
}

/**
 * The site's search (WO-154 Part 4): quests, people and places always; with `all`, also the builds players have made public and the guide's
 * chapters and sections (the command palette). Each hit says what it is and why it matched.
 */
export async function siteSearch(query: string, opts: { all?: boolean; limit?: number } = {}): Promise<SiteResults> {
  const limit = opts.limit ?? 20;
  const base = searchEverything(query, limit);
  const out: SiteResults = { ...base, builds: [], guide: [] };
  if (!opts.all) return out;
  const q = query.trim();
  if (!q) return out;
  try {
    const { builds } = await searchBuilds({ q, limit: 6 });
    out.builds = builds.map((b) => ({ kind: "Character" as const, name: b.name, href: `/b/${b.id}`, note: `By ${b.author.name ?? "a player"}`, why: "The words are in its name, description or choices" }));
  } catch {
    // No database here: no builds.
  }
  if (siteGuideOn()) {
    const w = words(q);
    for (const c of readGuide().chapters) {
      const cs = fuzzyScore(w, c.title);
      if (cs !== null) out.guide.push({ kind: "Guide", name: c.title, href: `/guide/${c.slug}`, note: "Guide chapter", why: "Matches the title" });
      for (const s of c.sections) {
        const ss = fuzzyScore(w, s.title);
        if (ss !== null) out.guide.push({ kind: "Guide", name: s.title, href: `/guide/${c.slug}#${s.id}`, note: c.title, why: "Matches the title" });
      }
    }
    out.guide = out.guide.slice(0, 8);
  }
  return out;
}
