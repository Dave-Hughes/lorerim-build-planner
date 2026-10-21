import Link from "next/link";
import { ReadTheStory } from "@/components/reader/reader";
import { AiAssisted } from "@/components/ui/ai-assisted";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import s from "./play.module.css";

/** "Made by Tapps", the AI assisted mark while shown (WO-117), the version. */
export function Byline({ p }: { p: PlaythroughRecord }) {
  return (
    <span className={s.byline}>
      <span>Made by {p.author.handle ? <Link href={`/u/${p.author.handle}`}>{p.author.name}</Link> : p.author.name}</span>
      {p.draftedBy && p.showDrafted && <AiAssisted author={p.author.name} className="muted" />}
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
    <span className={`on-image ${s.bandActions}`}>
      {isOwner && (
        <Link href={`/p/${p.id}/edit`} className="btn">
          Edit
        </Link>
      )}
      <CopyLinkButton path={`/p/${p.id}`} className="btn" />
    </span>
  );
  // The story, one click away (WO-118), where a build's page has its tab row.
  const read = <ReadTheStory className={s.heroRead} />;
  if (!cover)
    return (
      <div className={`frame ${s.band}`}>
        <div className={s.bandHead}>
          <h1 className={s.name}>{p.name}</h1>
          {actions}
        </div>
        {p.line && <span className={s.lineText}>{p.line}</span>}
        <Byline p={p} />
        {read}
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
        {read}
      </div>
      <span className={s.heroActions}>{actions}</span>
    </div>
  );
}
