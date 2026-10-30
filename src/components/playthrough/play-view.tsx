import { ModsNeeded } from "@/components/ui/mods-needed";
import { progressTracking } from "@/lib/features";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { CharacterPlay } from "./character-play";
import { RunCover } from "./run-cover";
import { PageTop } from "@/components/pages/page-kit";
import s from "./play.module.css";

/**
 * A run whose build the reader can't open, or that has none yet: the run's own band over its Playthrough view, with no tabs (WO-116; with a
 * build, the Playthrough is a tab of the character's page).
 */
export function PlayView({ p, isOwner, actIndex }: { p: PlaythroughRecord; isOwner: boolean; actIndex: number | null }) {
  return (
    <div className={s.rootNoBuild}>
      <div className={`page ${s.backRow}`}>
        <PageTop back={isOwner ? { href: "/me", label: "My characters" } : { href: "/characters", label: "Characters" }} />
      </div>
      <RunCover p={p} isOwner={isOwner} />
      <main className={`page ${s.main}`}>
        <ModsNeeded mods={p.mods} />
        <CharacterPlay p={p} isOwner={isOwner} actIndex={actIndex} />
      </main>
    </div>
  );
}

/** The Playthrough tab's line (WO-116, WO-181): how many acts. "x of y done" comes back only with progress tracking. */
export function playSub(p: PlaythroughRecord): string {
  const v = p.view;
  if (progressTracking() && v.total) return `${v.current ? `Act ${v.current.n}, ` : ""}${v.done} of ${v.total} done`;
  return v.acts.length ? `${v.acts.length} ${v.acts.length === 1 ? "act" : "acts"}` : "No acts yet";
}
