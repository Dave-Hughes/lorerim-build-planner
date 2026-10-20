import Link from "next/link";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { taleCount } from "@/lib/playthroughs/view";
import s from "./play.module.css";

/**
 * The playthrough's three views (WO-111): Play with "3 of 16 done", Tale with "4 chapters, 2 entries",
 * and Build, to the build's page, or "No build yet". The Tale view puts the way back beside them.
 */
export function PlaythroughTabs({ p, current, backTo }: { p: PlaythroughRecord; current: "play" | "tale"; backTo?: { href: string; label: string } }) {
  const v = p.view;
  return (
    <nav className={s.tabs} aria-label="Views">
      <Link href={`/p/${p.id}`} aria-current={current === "play" ? "page" : undefined}>
        Play<span className={s.cnt}>{v.total ? `${v.done} of ${v.total} done` : "no objectives yet"}</span>
      </Link>
      <Link href={`/p/${p.id}/tale`} aria-current={current === "tale" ? "page" : undefined}>
        Tale<span className={s.cnt}>{taleCount(v.counts)}</span>
      </Link>
      {p.build ? (
        <Link href={`/b/${p.build.id}`}>
          Build<span className={s.cnt}>{p.snapshot ? `level ${p.snapshot.level} of ${p.build.levels}` : `${p.build.levels} levels`}</span>
        </Link>
      ) : (
        <span className={s.cnt} style={{ display: "inline-flex", alignItems: "center", padding: "0 20px", height: 46 }}>
          No build yet
        </span>
      )}
      {backTo && (
        <Link href={backTo.href} className={s.backTo}>
          {backTo.label}
        </Link>
      )}
    </nav>
  );
}

/** "Made by Tapps", "Drafted with Claude" while shown, the version. */
export function Byline({ p }: { p: PlaythroughRecord }) {
  return (
    <span className={s.byline}>
      <span>Made by {p.author.handle ? <Link href={`/u/${p.author.handle}`}>{p.author.name}</Link> : p.author.name}</span>
      {p.build && (
        <span>
          Build: <Link href={`/b/${p.build.id}`}>{p.build.name}</Link>
        </span>
      )}
      {p.draftedBy && p.showDrafted && <span className="muted">Drafted with {p.draftedBy}</span>}
      <span className="muted">LoreRim {p.gameVersion}</span>
    </span>
  );
}
