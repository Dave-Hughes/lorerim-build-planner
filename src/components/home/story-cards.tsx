/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { questsData } from "@/lib/quests/data";
import { categoryRow } from "@/lib/quests/line-view";
import home from "./home.module.css";
import c from "./story-cards.module.css";

/**
 * Three stories to live through (WO-170, the board HomeWow): the main quest, Dragonborn and Dawnguard as three tall cards, each the scene
 * WO-168 drew for that story cut to the card (sky, far, the moving layer, near), its colour on the top edge, a big pixel number, the name, one
 * line, and its figures from the data. Under the pointer or focus a card lifts with a glow in its colour and the layers slide apart; the main
 * quest's Alduin flies, Dragonborn's tentacles sway faster, Dawnguard's bats scatter. Each card is one link to its story.
 */
const STORIES = [
  { id: "main-quest", cls: c.mq, layers: ["sky", "far", "dragon", "near"], extra: "embers" },
  { id: "dragonborn", cls: c.dbn, layers: ["sky", "far", "near", "tentacles"], extra: "ash" },
  { id: "dawnguard", cls: c.dg, layers: ["sky", "far", "bats", "near"], extra: null },
] as const;

/** The first sentence of the pitch: a card has room for one line of what it is about. */
const firstSentence = (t: string) => t.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? t;

export function ThreeStories() {
  const lines = questsData().byId;
  const cards = STORIES.flatMap((s, i) => {
    const line = lines.get(s.id);
    return line ? [{ s, n: i + 1, r: categoryRow(line, "main") }] : [];
  });
  if (cards.length < 3) return null;
  const embers = [14, 24, 36, 48, 60, 72, 84];
  return (
    <section className={home.sec} aria-labelledby="stories">
      <span className={home.head}>
        <h2 id="stories" className={home.h2}>
          Three stories to live through
        </h2>
        <Link href="/quests/c/main-stories">Every quest line ›</Link>
      </span>
      <div className={c.row}>
        {cards.map(({ s, n, r }) => (
          <Link key={s.id} href={r.href} className={`${c.card} ${s.cls}`} aria-labelledby={`story-${s.id}`}>
            {s.layers.map((name) => (
              <span key={name} className={c.layer}>
                <img className={`${c.l} ${c[name]}`} src={`/quests/stories/${s.id}/${name}.png`} alt="" />
              </span>
            ))}
            {s.extra === "embers" && (
              <span className={c.emb} aria-hidden="true">
                {embers.map((left, k) => (
                  <i key={k} style={{ left: `${left}%`, animationDelay: `${-((k * 0.6) % 3).toFixed(1)}s` }} />
                ))}
              </span>
            )}
            {s.extra === "ash" && <span className={c.ash} aria-hidden="true" />}
            <span className={c.shade} />
            <span className={c.n} aria-hidden="true">
              {n}
            </span>
            <span className={c.body}>
              <h3 id={`story-${s.id}`} className={c.h3}>
                {r.name}
              </h3>
              {r.pitch && <span className={c.p}>{firstSentence(r.pitch)}</span>}
              <span className={c.figs}>
                <span>{r.size.split(" in ")[0]}</span>
                {r.xp && (
                  <span className={c.xp}>
                    <b>{r.xp}</b> quest XP
                  </span>
                )}
                {r.levelNumber > 0 && <span className={c.lv}>{r.level}</span>}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
