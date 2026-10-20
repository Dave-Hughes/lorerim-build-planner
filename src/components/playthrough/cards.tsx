import Link from "next/link";
import type { PlaythroughCard } from "@/lib/playthroughs/queries";
import { roman } from "@/lib/playthroughs/view";
import { AiAssisted } from "@/components/ui/ai-assisted";
import s from "./play.module.css";

const VIS = { private: "Private", unlisted: "Link only", public: "Listed" } as const;

/** Playthrough cards (WO-111): name, line, the act the player is in, the AI assisted mark (WO-117), who can see it. */
export function PlaythroughCards({ rows, mine }: { rows: PlaythroughCard[]; mine?: boolean }) {
  return (
    <div className={s.cards}>
      {rows.map((p) => (
        <Link key={p.id} href={`/p/${p.id}`} className={`frame ${s.card}`}>
          <span className={s.cardName}>{p.name}</span>
          {p.line && <span className={s.cardLine}>{p.line}</span>}
          <span className={s.cardMeta}>
            <span>{p.acts ? `Act ${roman(Math.max(1, p.currentAct))} of ${roman(p.acts)}` : "No acts yet"}</span>
            {!mine && <span>by {p.author}</span>}
            {/* The card is one link: the mark without its "i". */}
            {p.draftedBy && p.showDrafted && <AiAssisted author={p.author} tip={false} />}
            {mine && <span>{VIS[p.visibility]}</span>}
          </span>
        </Link>
      ))}
    </div>
  );
}
