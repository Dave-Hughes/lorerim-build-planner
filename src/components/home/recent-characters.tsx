import Link from "next/link";
import { CharacterCard } from "@/components/build/character-card";
import type { BuildSummary } from "@/lib/builds/types";
import type { RunSummary } from "@/lib/playthroughs/queries";
import { RecentStrip } from "./recent-strip";
import home from "./home.module.css";

/**
 * Recent characters, dressed up (WO-157 Part 10): the five latest listed, each a portrait cover with its race, what it has (Featured, Video,
 * Playthrough: two at most), the name and the tagline, the race and traits, the maker, the likes and the planned level; a listed run adds its act.
 */
export function RecentCharacters({ builds, runs }: { builds: BuildSummary[]; runs?: Map<string, RunSummary> | null }) {
  if (!builds.length) return null;
  return (
    <section className={home.sec} aria-labelledby="recent">
      <span className={home.head}>
        <h2 id="recent" className={home.h2}>
          Recent characters
        </h2>
        <Link href="/characters">All characters ›</Link>
      </span>
      <RecentStrip>
        {builds.map((b) => (
          <CharacterCard key={b.id} build={b} run={runs?.get(b.id)} />
        ))}
      </RecentStrip>
    </section>
  );
}
