import Link from "next/link";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { taleCount } from "@/lib/playthroughs/view";
import s from "./play.module.css";

const VIS = { private: "Only you", unlisted: "Link only", public: "Listed" } as const;

/**
 * The character's three views (WO-111, WO-114): Play with "3 of 16 done", Tale with "4 chapters, 2
 * entries", and Build, the build itself under the run's cover, or "No build yet". On the Build tab,
 * the right side says how the build shares on its own, with its link and Edit for the owner.
 */
export function PlaythroughTabs({ p, current, backTo, isOwner = false }: { p: PlaythroughRecord; current: "play" | "tale" | "build"; backTo?: { href: string; label: string }; isOwner?: boolean }) {
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
        <Link href={`/p/${p.id}/build`} aria-current={current === "build" ? "page" : undefined}>
          Build<span className={s.cnt}>{p.snapshot ? `level ${p.snapshot.level} of ${p.build.levels}` : `levels 1 to ${p.build.levels}`}</span>
        </Link>
      ) : (
        <span className={s.cnt} style={{ display: "inline-flex", alignItems: "center", padding: "0 20px", height: 46 }}>
          No build yet
        </span>
      )}
      {current === "build" && p.build && (
        <span className={s.buildSide}>
          <span className="muted">The build on its own: {VIS[p.build.visibility]}</span>
          <CopyLinkButton path={`/b/${p.build.id}`} label="Copy the build's link" />
          {isOwner && (
            <Link href={`/b/${p.build.id}/edit`} className="btn btn-sm">
              Edit the build
            </Link>
          )}
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
      {p.draftedBy && p.showDrafted && <span className="muted">Drafted with {p.draftedBy}</span>}
      <span className="muted">LoreRim {p.gameVersion}</span>
    </span>
  );
}

/**
 * The character's cover (WO-114): the build's cover, full width and 440 tall, with the name, line and
 * byline over its dark fade and Edit and Copy link top right, as the build page leads (design rule
 * 12). No cover, or no build yet: the plain dark band.
 */
export function RunHero({ p, isOwner }: { p: PlaythroughRecord; isOwner: boolean }) {
  const cover = p.build?.coverImageUrl ?? null;
  const focus = p.build?.coverFocus;
  const actions = (
    <span className={s.bandActions}>
      {isOwner && (
        <Link href={`/p/${p.id}/edit`} className="btn">
          Edit
        </Link>
      )}
      <CopyLinkButton path={`/p/${p.id}`} className="btn" />
    </span>
  );
  if (!cover)
    return (
      <div className={`frame ${s.band}`}>
        <div className={s.bandHead}>
          <h1 className={s.name}>{p.name}</h1>
          {actions}
        </div>
        {p.line && <span className={s.lineText}>{p.line}</span>}
        <Byline p={p} />
      </div>
    );
  return (
    <div className={`frame ${s.hero}`}>
      <div className={s.heroImage} style={{ backgroundImage: `url("${cover}")`, backgroundPosition: focus ? `${focus.x}% ${focus.y}%` : undefined }} aria-hidden="true" />
      <span className={s.heroFade} aria-hidden="true" />
      <div className={s.heroText}>
        <h1 className={s.name}>{p.name}</h1>
        {p.line && <span className={s.lineText}>{p.line}</span>}
        <Byline p={p} />
      </div>
      <span className={s.heroActions}>{actions}</span>
    </div>
  );
}
