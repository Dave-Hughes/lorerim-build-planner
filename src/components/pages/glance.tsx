/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import l from "@/components/quests/line-page.module.css";

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
