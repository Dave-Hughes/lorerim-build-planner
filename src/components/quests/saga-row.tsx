/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CategoryRow } from "@/lib/quests/line-view";
import c from "./saga.module.css";

/**
 * A main story's row (WO-168, the board MainStoriesHard): the story's own scene in layers behind the words, its colour on the left edge, the
 * big number, the name, tags and a line of what it's about, quest XP and Open the story. Under the pointer or keyboard focus the row grows
 * and the layers part; each story does its own thing (Alduin flies, Apocrypha reaches up, the eclipse burns). The art is
 * public/quests/stories/<line>/*.png, 320 by 80, shown at four times.
 */
const STORIES: Record<string, { cls: string; layers: string[]; extra: "embers" | "ash" | "corona" | null; accent: string | null }> = {
  "main-quest": { cls: c.mq, layers: ["sky", "far", "dragon", "near"], extra: "embers", accent: null },
  dragonborn: { cls: c.dbn, layers: ["sky", "far", "near", "tentacles"], extra: "ash", accent: "Solstheim and Apocrypha" },
  dawnguard: { cls: c.dg, layers: ["sky", "far", "bats", "near"], extra: "corona", accent: "Two sides" },
};

/** The first sentence of the pitch: a row has room for one line of what it is about. */
const firstSentence = (t: string) => {
  const m = t.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : t;
};

export const hasSaga = (id: string) => id in STORIES;

export function SagaRow({ r, n, open }: { r: CategoryRow; n: number; open: string }) {
  const art = STORIES[r.id];
  if (!art) return null;
  const embers = [52, 58, 63, 70, 76, 83, 89, 95];
  return (
    <article className={c.wrap} aria-labelledby={`saga-${r.id}`}>
      <Link href={r.href} className={`${c.saga} ${art.cls}`} aria-labelledby={`saga-${r.id} saga-${r.id}-go`}>
        {art.layers.map((name) => (
          <span key={name} className={c.layer}>
            {name === "sky" && art.extra === "corona" ? <i className={c.corona} /> : null}
            <img className={`${c.l} ${c[name]}`} src={`/quests/stories/${r.id}/${name}.png`} alt="" />
          </span>
        ))}
        {art.extra === "embers" && (
          <span className={c.emb} aria-hidden="true">
            {embers.map((left, i) => (
              <i key={i} style={{ left: `${left}%`, animationDelay: `${-((i * 0.6) % 3).toFixed(1)}s` }} />
            ))}
          </span>
        )}
        {art.extra === "ash" && <span className={c.ash} aria-hidden="true" />}
        <span className={c.glow} />
        <span className={c.shade} />
        <span className={c.body}>
          <span className={c.n}>{n}</span>
          <span>
            <h2 id={`saga-${r.id}`} className={c.h2}>
              {r.name}
            </h2>
            <span className={c.tags}>
              {(r.lineTag ?? art.accent) && <span className={`${c.tag} ${c.a}`}>{r.lineTag ?? art.accent}</span>}
              <span className={`${c.tag} ${c.lv}`}>{r.level}</span>
              <span className={c.tag}>{r.size}</span>
            </span>
            {r.pitch && <p className={c.p}>{firstSentence(r.pitch)}</p>}
            {r.reveal.length > 0 && (
              <span className={c.reveal} aria-hidden="true">
                <span className={c.ch}>
                  {r.reveal.map((x, i) => (
                    <span key={i}>{x}</span>
                  ))}
                </span>
              </span>
            )}
          </span>
        </span>
        <span className={c.side}>
          {r.xp && (
            <>
              <span className={c.xpl}>Quest XP</span>
              <span className={c.xpv}>{r.xp}</span>
            </>
          )}
          <span id={`saga-${r.id}-go`} className={c.go}>
            {open}
          </span>
        </span>
      </Link>
    </article>
  );
}
