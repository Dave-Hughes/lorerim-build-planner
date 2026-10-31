/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import l from "@/components/quests/line-page.module.css";
import g from "./glance-list.module.css";

/**
 * At a glance (WO-165, the band the line page and a place's page have): five or fewer facts under the title, each its own colour, the colours
 * meaning one thing each (rule 34): green how to start, red level and danger, teal places, orange people, gold XP and rewards, violet choices.
 */
export type Tone = "green" | "red" | "teal" | "orange" | "gold" | "violet";
export interface GlanceCell {
  key: string;
  icon: string;
  tone: Tone;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  small?: boolean;
  /** The section under the band says this again: on a phone the cell is left out. */
  hidePhone?: boolean;
  /** What is too long for a list beside the frame (who keeps each shop, who trains what): folded under the fact, opened by its label (WO-184 Part 9). */
  more?: { label: string; node: ReactNode };
}

const TONE: Record<Tone, string> = { green: l.cGreen, red: l.cRed, teal: l.cTeal, orange: l.cOrange, gold: l.cGold, violet: l.cViolet };

export function GlanceBand({ cells }: { cells: GlanceCell[] }) {
  if (!cells.length) return null;
  return (
    <section className={l.band} aria-label="At a glance">
      <div className={`page ${l.glance}`} style={{ "--cols": cells.length } as CSSProperties}>
        {cells.map((c) => (
          <div key={c.key} className={`${l.gl} ${c.hidePhone ? l.glHidePhone : ""}`}>
            <span className={`${l.k} ${TONE[c.tone]}`}>
              <img className={l.px} src={`/icons/${c.icon}.svg`} alt="" width={18} height={18} />
              {c.label}
            </span>
            <span className={`${l.v} ${c.tone === "gold" ? l.cGold : ""} ${c.small ? l.vSmall : ""}`}>{c.value}</span>
            {c.sub ? <span className={l.s}>{c.sub}</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The same facts as a two-column list (WO-184 Part 8, board PlaceOptB): under the title, beside the frame, so the page's first section starts on the first screen. Each
 * fact keeps its colour and its icon; a fact with nothing to say is not drawn.
 */
export function GlanceList({ cells }: { cells: GlanceCell[] }) {
  if (!cells.length) return null;
  return (
    <section className={g.list} aria-label="At a glance">
      {cells.map((c) => (
        <div key={c.key} className={`${g.cell} ${c.hidePhone ? g.hidePhone : ""}`}>
          <span className={`${g.k} ${TONE[c.tone]}`}>
            <img className={g.px} src={`/icons/${c.icon}.svg`} alt="" width={16} height={16} />
            {c.label}
          </span>
          <span className={g.v}>{c.value}</span>
          {c.sub ? <span className={g.s}>{c.sub}</span> : null}
          {c.more && (
            <details className={g.more}>
              <summary>{c.more.label}</summary>
              <div className={g.moreBody}>{c.more.node}</div>
            </details>
          )}
        </div>
      ))}
    </section>
  );
}
