/* eslint-disable @next/next/no-img-element */
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlongTheWay, StoryOpens, StorySoFar } from "@/components/quests/story-parts";
import { categories, mainOrder } from "@/lib/quests/data";
import { checkedLabel, splitReward, storyOrder } from "@/lib/quests/story";
import { storyById } from "@/lib/quests/stories-data";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/quests/quests.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = storyById((await params).id);
  return s ? { title: s.name, ...siteMetadata(`/quests/s/${s.id}`, s.name, s.pitch) } : {};
}

/**
 * A story (WO-106, QuestStory): a big quest line told as an adventure, from Bob's checked
 * stories.json. Your next step, the story so far, what it opens, and how it starts.
 */
export default async function StoryPage({ params }: { params: Params }) {
  await loadPlayerFacts();
  const story = storyById((await params).id);
  if (!story) notFound();
  const home = categories().find((c) => c.key === story.category);
  const slug = home?.slug ?? "main-stories";
  const order = storyOrder(story);
  const main = mainOrder().map((m) => m.edid);
  const xp = order.reduce((n, q) => n + q.xp, 0);
  const same = order.every((q) => q.xp === order[0]?.xp) && order[0]?.xp > 0;
  const reward = story.reward ? splitReward(story.reward.text) : null;
  return (
    <main className={`page ${styles.main} ${styles.inner}`}>
      <Link href={`/quests/c/${slug}`} className={styles.back}>
        ‹ {home?.name ?? "Quests"}
      </Link>
      <div className={`frame ${styles.cover}`}>
        <img src={`/quests/${slug}.png`} alt="" className={styles.coverArt} />
        <span className={styles.coverFade} aria-hidden="true" />
        <div className={styles.coverWords}>
          <span className={styles.coverName}>
            <img className={styles.px} src={`/icons/quest-${slug}.svg`} alt="" width={48} height={48} />
            <h1 className={`title ${styles.coverTitle}`}>{story.name}</h1>
          </span>
          <span className={styles.coverMeta}>
            <span>{story.lineName}</span>
            {story.sources.map((s) =>
              s.modid ? (
                <a key={s.name} href={`https://www.nexusmods.com/skyrimspecialedition/mods/${s.modid}`} target="_blank" rel="noreferrer" className={`${styles.tag} ${styles.mod}`}>
                  {s.name} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span key={s.name} className={styles.tag}>
                  {s.name}
                </span>
              ),
            )}
            <span className="muted">
              {story.chapters.length} chapters | {order.length} quests
            </span>
          </span>
        </div>
      </div>

      <div className={styles.storyGrid}>
        <div className={styles.storyMain}>
          <p className={`${styles.pitch} ${styles.oPitch}`}>{story.pitch}</p>
          <div className={styles.oSoFar}>
            <StorySoFar story={story} mainOrder={main} />
          </div>
          <div className={styles.oAlong}>
            <AlongTheWay story={story} />
          </div>
        </div>
        <aside className={styles.storySide}>
          <div className={`${styles.factRow} ${styles.twoFacts} ${styles.oFacts}`}>
            <span className={styles.fact}>
              <b>Quest XP</b>
              <span>{xp.toLocaleString("en-US")}</span>
              {same && <small>{order[0].xp} a quest</small>}
            </span>
            {reward && (
              <span className={styles.fact}>
                <b>Reward at the end</b>
                <span>{reward.head}</span>
                <small>
                  {reward.note}
                  {story.reward!.checked === "not yet" && `${reward.note ? ". " : ""}not checked yet`}
                </small>
              </span>
            )}
          </div>
          <div className={styles.oOpens}>
            <StoryOpens story={story} mainOrder={main} />
          </div>
          <section className={`${styles.panel} ${styles.sidePanel} ${styles.oStarts}`} aria-labelledby="starts-title">
            <h2 id="starts-title" className={styles.sideTitle}>
              How it starts
            </h2>
            {story.start.map((s, i) => (
              <span key={i} className={styles.soft}>
                {s.text}
                <span className={styles.src}>{checkedLabel(s.checked)}</span>
              </span>
            ))}
          </section>
          <Link href={`/quests/${story.line}?report=1#report`} className={`${styles.wrong} ${styles.oWrong}`}>
            This was wrong ›
          </Link>
        </aside>
      </div>
    </main>
  );
}
