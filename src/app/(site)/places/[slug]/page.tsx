/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConfirmButton } from "@/components/pages/confirm-button";
import { SignInButton } from "@/components/site-header";
import { confirmationsOf } from "@/lib/quests/confirmations";
import { PreviewLink } from "@/components/pages/preview-link";
import { Gold, InformationConfidence, Icon, PageTop, Panel, Section, TitleBox } from "@/components/pages/page-kit";
import { personHref } from "@/lib/people/data";
import { questsData } from "@/lib/quests/data";
import { hasLevels, placeBySlug, placeHref, placeType, rangeOf } from "@/lib/places/data";
import { PlaceSaid, PlaceTown, levelRange } from "@/components/places/place-town";
import { placeKind } from "@/lib/places/kind";
import { playerFacing } from "@/lib/places/said";
import l from "@/components/quests/line-page.module.css";
import { levelWords, pageOf } from "@/lib/quests/reads";
import { questHref } from "@/lib/quests/slugs";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const PLURAL: Record<string, string> = { Bandit: "Bandits", Draugr: "Draugr", Skeleton: "Skeletons", Falmer: "Falmer", Forsworn: "Forsworn", Giant: "Giants", Warlock: "Warlocks", Spider: "Spiders", Wolf: "Wolves", Vampire: "Vampires", Troll: "Trolls" };

/** The levels a boss's words give: "leveled 19-24" is 19 to 24; "45" is 45 to 45. */
/** Where it is from the town: "next to Riverwood", "a short walk from Whiterun", else "near Riverwood". */
const nearWords = (t: { town: string; walk?: string }) => (t.walk === "next to it" ? `next to ${t.town}` : t.walk ? `${t.walk} from ${t.town}` : `near ${t.town}`);

/** "after 300 days once cleared, 30 ordinarily" as "In 30 days, or 300 once cleared". */
function respawnWords(r: string): string {
  if (r === "never") return "Never. Once cleared, it stays cleared.";
  const m = /^after (\d+) days once cleared, (\d+) ordinarily$/.exec(r);
  return m ? `In ${m[2]} days, or ${m[1]} once cleared` : r.charAt(0).toUpperCase() + r.slice(1);
}

const bossRange = (level: string | undefined): [number, number] | null => {
  const m = /(\d+)(?:\s*-\s*(\d+))?/.exec(level ?? "");
  return m ? [Number(m[1]), Number(m[2] ?? m[1])] : null;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = placeBySlug((await params).slug);
  if (!p) return {};
  return { title: p.name, ...siteMetadata(`${placeHref(p.name)}`, p.name, [placeType(p.type), p.hold].filter(Boolean).join(" in ")) };
}

/** Which expansion or mod a place's record is from, by its form id's plugin: "Vanilla" for the base game. */
const originOf = (id: string) => {
  const plugin = id.split(":")[0].toLowerCase();
  return plugin === "skyrim.esm" ? "Vanilla" : ({ "dawnguard.esm": "Dawnguard", "dragonborn.esm": "Dragonborn", "hearthfires.esm": "Hearthfires" } as Record<string, string>)[plugin] ?? null;
};

/**
 * A place's page (WO-154 Part 2), from the canvas board "Place page: Broken Oar Grotto", out of places.json: what lives there and how
 * strong, what is worth going for, the quests that bring you here, what points here in the game's own words, and what finding and clearing it pay.
 */
export default async function PlacePage({ params }: { params: Params }) {
  const place = placeBySlug((await params).slug);
  if (!place) notFound();
  const slug = (await params).slug;
  const userId = (await auth())?.user?.id ?? null;
  const confirmed = await confirmationsOf("place", slug, userId);
  const a = place.actors;
  const levels = hasLevels(a) && a.hostile !== false ? rangeOf(a!) : null;
  const boss = a?.boss?.name ? { name: a.boss.name, range: bossRange(a.boss.level), words: levelWords(a.boss.level) } : null;
  const foes = a?.livesHere ? (PLURAL[a.livesHere] ?? `${a.livesHere}s`) : "Enemies";
  const town = place.nearestTown;
  const origin = originOf(place.id);
  const worth = place.worthGoingFor;
  const hasWorth = !!(worth?.skillBooks?.length || worth?.bossChest || worth?.crafting?.length);

  // The quests that go here, with what each one says about it.
  const byName = new Map(questsData().lines.flatMap((l) => l.quests.map((q) => [q.name, q] as const)));
  const quests = (place.quests ?? []).flatMap((name) => {
    const q = byName.get(name);
    const href = q ? questHref(q.edid) : null;
    if (!q || !href || !playerFacing(name)) return [];
    const says = pageOf(q).takesYou.find((t) => t.place.toLowerCase() === place.name.toLowerCase())?.why;
    return [{ name, href, says }];
  });
  // "A Nordic ruin next to Riverwood": the type's own capital stays for a people or a land (Nordic, Dwemer), a common noun starts small.
  const type = placeType(place.type);
  const kind = /^(Nordic|Dwemer|Imperial|Daedric|Orc|Orsimer)\b/.test(type) ? type : `${type.charAt(0).toLowerCase()}${type.slice(1)}`;
  const near = town ? nearWords(town) : null;
  const lede = `${/^[AEIOU]/i.test(type) ? "An" : "A"} ${kind}${near ? ` ${near}` : place.hold ? ` in ${place.hold}` : ""}.${boss ? ` Its boss is ${boss.name}.` : ""}`.replace(/\s+/g, " ");
  const ic = (
    <InformationConfidence
      id="sure"
      line="Counted from the game files."
      sources={[
        { mark: "yes", name: "LoreRim's game files", note: "Who lives here, the boss, books, crafting and XP, read from the records" },
        confirmed.names.length
          ? { mark: "yes", name: "Players", note: `Confirmed by ${confirmed.names.length} ${confirmed.names.length === 1 ? "player" : "players"}`, names: confirmed.names.map((n) => <span key={n}>{n}</span>) }
          : { mark: "no", name: "Players", note: "No reports. No one has confirmed this page yet." },
      ]}
      unsure={worth?.bossChest ? [{ field: "what's in the boss chest" }] : []}
      actions={
        <>
          <ConfirmButton kind="place" id={slug} path={`/places/${slug}`} title={place.name} signedIn={!!userId} mine={confirmed.mine} signIn={<SignInButton redirectTo={`/places/${slug}`} className="btn btn-primary" label="Sign in to confirm" />} />
          <Link href="/quests" className="btn">
            Report a mistake
          </Link>
        </>
      }
    />
  );
  const pkind = placeKind(place);
  if (pkind !== "dangerous") {
    const goodToKnow: [string, string][] = [
      ...(place.inTown ? ([["In", place.inTown]] as [string, string][]) : []),
      ...(place.hold ? ([["Hold", place.hold]] as [string, string][]) : []),
      ...(town ? ([["Nearest town", `${town.town}${town.walk ? `, ${town.walk}` : ""}`]] as [string, string][]) : []),
    ];
    return <PlaceTown place={place} kind={pkind} origin={origin} near={near} ic={ic} goodToKnow={goodToKnow} />;
  }
  const tick = (n: number) => (n === 1 ? "Level 1" : String(n));

  // At a glance (WO-162, the colours of rule 34): danger in red, the boss and people in orange, what it pays in gold, when it comes back, and the nearest town in teal.
  const glance: { key: string; icon: string; tone: string; label: string; value: React.ReactNode; sub?: React.ReactNode }[] = [
    ...(levels ? [{ key: "danger", icon: "tab-levels", tone: l.cRed, label: "Danger", value: levelRange(levels), sub: `${foes}${a?.alsoHere?.length ? `, ${a.alsoHere.map((x) => PLURAL[x] ?? `${x}s`).join(", ")} too` : ""}` }] : a?.hostile === false ? [{ key: "danger", icon: "tab-levels", tone: l.cRed, label: "Danger", value: "None", sub: "Nobody here is hostile" }] : []),
    ...(boss ? [{ key: "boss", icon: "quest-people", tone: l.cOrange, label: "The boss", value: personHref(boss.name) ? <PreviewLink href={personHref(boss.name)!}>{boss.name}</PreviewLink> : boss.name, sub: boss.words ? `Level ${boss.words}` : undefined }] : []),
    ...(place.clearXp || place.discoveryXp ? [{ key: "xp", icon: "quest-rewards", tone: l.cGold, label: "Rewards", value: `${place.clearXp || place.discoveryXp} XP`, sub: [place.clearXp ? "For clearing it" : "", place.discoveryXp && place.clearXp ? `${place.discoveryXp} XP for finding it` : place.discoveryXp ? "For finding it" : ""].filter(Boolean).join("; ") }] : []),
    ...(place.respawns ? [{ key: "back", icon: "tab-set-up", tone: l.cOrange, label: "Comes back", value: respawnWords(place.respawns), sub: undefined }] : []),
    ...(town ? [{ key: "town", icon: "quest-travel", tone: l.cTeal, label: "Nearest town", value: town.town, sub: town.walk ? town.walk.charAt(0).toUpperCase() + town.walk.slice(1) : undefined }] : []),
  ];

  return (
    <main className={l.root}>
      <div className={`page ${l.top}`}>
      <PageTop back={{ href: "/places", label: "Places" }} />

      <TitleBox
        title={place.name}
        tags={
          <>
            <span className={styles.tag}>{placeType(place.type)}</span>
            {place.hold && <span className={styles.tag}>{place.hold}</span>}
            {origin && <span className={styles.tag}>{origin}</span>}
            {near && <span className={styles.tagText}>{near.charAt(0).toUpperCase()}{near.slice(1)}</span>}
          </>
        }
      />

      <p className={styles.lede}>{lede}</p>
      </div>

      <section className={l.band} aria-label="At a glance">
        <div className={`page ${l.glance}`} style={{ "--cols": glance.length } as React.CSSProperties}>
          {glance.map((c) => (
            <div key={c.key} className={l.gl}>
              <span className={`${l.k} ${c.tone}`}>
                <img className={l.px} src={`/icons/${c.icon}.svg`} alt="" width={18} height={18} />
                {c.label}
              </span>
              <span className={`${l.v} ${typeof c.value === "string" && c.value.length > 18 ? l.vSmall : ""}`}>{c.value}</span>
              {c.sub ? <span className={l.s}>{c.sub}</span> : null}
            </div>
          ))}
        </div>
      </section>

      <div className={`page ${styles.cols}`} style={{ paddingTop: 52 }}>
        <div className={styles.body}>
          <Section id="danger" icon="chapter-death" title="Danger">
            {levels ? (
              <>
                <div className={styles.gauge} role="img" aria-label={`${foes} from level ${levels[0]} to ${levels[1]}${boss?.range ? `; the boss from level ${boss.range[0]} to ${boss.range[1]}` : ""}, on a scale of 1 to 50`}>
                  <span className={styles.band} style={{ gridColumn: `${Math.min(levels[0], 50)} / ${Math.min(levels[1], 50) + 1}`, gridRow: 1 }}>
                    {foes} {levels[0] === levels[1] ? levels[0] : `${levels[0]} to ${levels[1]}`}
                  </span>
                  {boss?.range && (
                    <span className={`${styles.band} ${styles.bandBoss}`} style={{ gridColumn: `${Math.min(boss.range[0], 50)} / ${Math.min(boss.range[1], 50) + 1}`, gridRow: 2 }}>
                      Boss {boss.range[0] === boss.range[1] ? boss.range[0] : `${boss.range[0]} to ${boss.range[1]}`}
                    </span>
                  )}
                </div>
                <div className={styles.gticks} aria-hidden="true">
                  {[1, 10, 20, 30, 40].map((n, i) => (
                    <span key={n} style={{ gridColumn: i === 0 ? "1 / 10" : `${n} / ${n + 10}` }}>
                      {tick(n)}
                    </span>
                  ))}
                  <span style={{ gridColumn: 50, justifySelf: "end" }}>50</span>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div className={styles.foe}>
                    <b>{foes}</b>
                    <span className={styles.lv}>{levels[0] === levels[1] ? `Level ${levels[0]}` : `Level ${levels[0]} to ${levels[1]}`}</span>
                    {(a?.alsoHere?.length || a?.count) && (
                      <small>
                        {a?.alsoHere?.length ? `${a.alsoHere.map((x) => PLURAL[x] ?? `${x}s`).join(", ")} too. ` : ""}
                        {a?.count ? `${a.count} in all.` : ""}
                      </small>
                    )}
                  </div>
                  {boss && (
                    <div className={`${styles.foe} ${styles.foeBoss}`}>
                      <b>
                        The boss: {personHref(boss.name) ? <PreviewLink href={personHref(boss.name)!}>{boss.name}</PreviewLink> : boss.name}
                      </b>
                      {boss.words ? <span className={styles.lv}>Level {boss.words}</span> : null}
                    </div>
                  )}
                </div>
              </>
            ) : a?.hostile === false ? (
              <p className={styles.way}>Nobody here is hostile.</p>
            ) : (
              <p className={styles.way}>
                <span className={styles.muted}>How dangerous it is isn&apos;t known yet.</span>
              </p>
            )}
            {place.danger?.traps && (
              <div className={styles.flag}>
                <b>!</b>
                <span>Traps</span>
              </div>
            )}
          </Section>

          {hasWorth && (
            <Section id="worth" icon="mark-skill-book" title="Worth going for">
              {worth?.skillBooks?.map((b) => (
                <div key={b} className={styles.worth}>
                  <Icon name="mark-skill-book" />
                  <b>{b.includes(": ") ? b.split(": ")[1] : b}</b>
                  <small>{b.includes(": ") ? `A ${b.split(": ")[0]} skill book` : "A skill book"}</small>
                </div>
              ))}
              {worth?.bossChest && (
                <div className={styles.worth}>
                  <Icon name="quest-chest" />
                  <b>A boss chest</b>
                </div>
              )}
              {worth?.crafting?.length ? (
                <div className={styles.worth}>
                  <Icon name="smithing" />
                  <b>{worth.crafting.join(", ").replace(/, ([^,]*)$/, " and $1").replace(/^./, (c) => c.toUpperCase())}</b>
                  <small>For crafting and improving gear</small>
                </div>
              ) : null}
            </Section>
          )}

          {quests.length > 0 && (
            <Section id="quests" icon="tab-play" title="Quests that bring you here">
              {quests.map((q) => (
                <div key={q.href} className={styles.qrow} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
                  <PreviewLink href={q.href}>{q.name}</PreviewLink>
                  {q.says ? <span>{q.says.charAt(0).toUpperCase() + q.says.slice(1)}{q.says.endsWith(".") ? "" : "."}</span> : null}
                </div>
              ))}
            </Section>
          )}

          <PlaceSaid place={place} />
        </div>

        <aside className={styles.side}>
          {(place.discoveryXp || place.clearXp) && (
            <Gold id="xp">
              {place.discoveryXp ? (
                <span className={styles.rw}>
                  <span>{place.discoveryXp} XP</span>
                  <small>For finding it</small>
                </span>
              ) : null}
              {place.clearXp ? (
                <span className={styles.rw}>
                  <span>{place.clearXp} XP</span>
                  <small>For clearing it</small>
                </span>
              ) : null}
            </Gold>
          )}
          <Panel id="facts" title="Good to know">
            <div className={styles.facts}>
              {place.hold && (
                <span>
                  <b>Hold</b>
                  {place.hold}
                </span>
              )}
              {town && (
                <span>
                  <b>Nearest town</b>
                  <span>
                    {town.town}
                    {town.walk ? `, ${town.walk}` : ""}
                  </span>
                </span>
              )}
              {place.respawns && (
                <span>
                  <b>Comes back</b>
                  {respawnWords(place.respawns)}
                </span>
              )}
            </div>
          </Panel>
        </aside>
      </div>

      <div className={`page ${l.foot}`}>{ic}</div>
    </main>
  );
}
