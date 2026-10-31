/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ConfirmButton } from "@/components/pages/confirm-button";
import { SignInButton } from "@/components/site-header";
import { pageExtras } from "@/components/pages/page-extras";
import { ReportMistake } from "@/components/pages/report-mistake";
import { PreviewLink } from "@/components/pages/preview-link";
import { InformationConfidence, Icon, PageTop, Section, TitleBox } from "@/components/pages/page-kit";
import { LineToc } from "@/components/quests/line-parts";
import { PlaceMapBand } from "@/components/places/place-map";
import { ShotHero } from "@/components/screenshots/shot-hero";
import { ShotsSection } from "@/components/screenshots/shots-section";
import { personHref } from "@/lib/people/data";
import { questsData } from "@/lib/quests/data";
import { afterWar, hasLevels, isGarrison, placeByRecordName, placeBySlug, placeHrefOf, placeLabel, placesSharingSlug, placeType, rangeOf, type Place } from "@/lib/places/data";
import { PlaceTown, levelRange } from "@/components/places/place-town";
import { placeKind } from "@/lib/places/kind";
import { playerFacing } from "@/lib/places/said";
import l from "@/components/quests/line-page.module.css";
import { levelWords, pageOf } from "@/lib/quests/reads";
import { questHref } from "@/lib/quests/slugs";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";
import { holdWords } from "@/lib/places/hold-words";
import { placeUnsure } from "@/lib/places/unsure";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

const PLURAL: Record<string, string> = { Bandit: "Bandits", Draugr: "Draugr", Skeleton: "Skeletons", Falmer: "Falmer", Forsworn: "Forsworn", Giant: "Giants", Warlock: "Warlocks", Spider: "Spiders", Wolf: "Wolves", Vampire: "Vampires", Troll: "Trolls" };

/** The levels a boss's words give: "leveled 19-24" is 19 to 24; "45" is 45 to 45. */
/** Where it is from the town: "next to Riverwood", "a short walk from Whiterun", else "near Riverwood". */
const nearWords = (t: { town: string; walk?: string }) => (t.walk === "next to it" ? `next to ${t.town}` : t.walk ? `${t.walk} from ${t.town}` : `near ${t.town}`);

/** "after 300 days once cleared, 30 ordinarily" as "In 30 days, or 300 days once cleared". */
function respawnWords(r: string): string {
  if (r === "never") return "Never. Once cleared, it stays cleared.";
  const m = /^after (\d+) days once cleared, (\d+) ordinarily$/.exec(r);
  return m ? `In ${m[2]} days, or ${m[1]} days once cleared` : r.charAt(0).toUpperCase() + r.slice(1);
}

const bossRange = (level: string | undefined): [number, number] | null => {
  const m = /(\d+)(?:\s*-\s*(\d+))?/.exec(level ?? "");
  return m ? [Number(m[1]), Number(m[2] ?? m[1])] : null;
};

/** A name more than one place has ("Imperial Military Camp" is eight): the address of the name alone lists them, each with its own page (WO-172). */
function WhichOne({ places }: { places: Place[] }) {
  const name = places[0].name;
  return (
    <main className={l.root}>
      <div className={`page ${l.top}`}>
        <PageTop back={{ href: "/places", label: "Places" }} />
        <TitleBox title={name} tags={<span className={styles.tag}>{places.length} places</span>} />
        <p className={styles.lede}>{places.length} places in Skyrim are called {name}. Which one?</p>
      </div>
      <div className="page" style={{ paddingTop: 16, width: "100%" }}>
        <div style={{ maxWidth: 760 }}>
          <section className={styles.sec} aria-label={`The places called ${name}`}>
            {[...places]
              .sort((a, b) => placeLabel(a).localeCompare(placeLabel(b)))
              .map((p) => (
                <div key={p.id} className={styles.qrow}>
                  <Link href={placeHrefOf(p)}>{placeLabel(p)}</Link>
                  <span>{[placeType(p.type), p.hold ? `${holdWords(p.hold)}` : null, p.nearestTown ? `near ${p.nearestTown.town}` : p.inTown ? `in ${p.inTown}` : ""].filter(Boolean).join(", ")}</span>
                </div>
              ))}
          </section>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).slug;
  const p = placeBySlug(slug);
  if (!p) {
    const several = placesSharingSlug(slug);
    return several ? { title: several[0].name, ...siteMetadata(`/places/${slug}`, several[0].name, `${several.length} places share this name`) } : {};
  }
  return { title: placeLabel(p), ...siteMetadata(placeHrefOf(p), placeLabel(p), [placeType(p.type), p.hold ? `${holdWords(p.hold)}` : null].filter(Boolean).join(", ")) };
}

/** Which expansion or mod a place's record is from, by its form id's plugin: "Base game". */
const originOf = (id: string) => {
  const plugin = id.split(":")[0].toLowerCase();
  return plugin === "skyrim.esm" ? "Base game" : ({ "dawnguard.esm": "Dawnguard", "dragonborn.esm": "Dragonborn", "hearthfires.esm": "Hearthfires" } as Record<string, string>)[plugin] ?? null;
};

/**
 * A place's page (WO-154 Part 2), from the canvas board "Place page: Broken Oar Grotto", out of places.json: what lives there and how
 * strong, what is worth going for, the quests that bring you here, what points here in the game's own words, and what finding and clearing it pay.
 */
export default async function PlacePage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const place = placeBySlug(slug);
  if (!place) {
    // A place's old address, by the name its record gave it, goes to its in-game name (WO-183 Part 4).
    const was = placeByRecordName(slug);
    if (was) permanentRedirect(placeHrefOf(was));
    const several = placesSharingSlug(slug);
    if (!several) notFound();
    return <WhichOne places={several} />;
  }
  const x = await pageExtras("place", slug, `/places/${slug}`);
  const { userId, confirmed } = x;
  const a = place.actors;
  // A camp with a guard or two before the war and a garrison after it (WO-172): the page gives the garrison's levels and says so, not the guard's.
  const war = a?.hostile === false ? null : afterWar(a);
  const garrison = isGarrison(a) && !!war;
  const levels = garrison ? war!.range : hasLevels(a) && a.hostile !== false ? rangeOf(a!) : null;
  const bossFrom = garrison ? war!.boss : a?.boss;
  const boss = bossFrom?.name ? { name: bossFrom.name, range: bossRange(bossFrom.level), words: levelWords(bossFrom.level) } : null;
  const livesHere = garrison ? war!.livesHere : a?.livesHere;
  const foes = garrison ? "After the war" : livesHere ? (PLURAL[livesHere] ?? `${livesHere}s`) : "Enemies";
  const alsoHere = garrison ? war!.alsoHere : a?.alsoHere;
  const inAll = garrison ? war!.count : a?.count;
  const town = place.nearestTown;
  const origin = originOf(place.id);
  const worth = place.worthGoingFor;
  // A crafting station (an alchemy lab, an enchanting table, a forge, a tanning rack) is everywhere: it is not a reason to go (WO-185 Part 4). Towns say theirs under Crafting and shrines.
  const hasWorth = !!(worth?.skillBooks?.length || worth?.wordWall?.length || worth?.bossChest || worth?.shrines?.length);
  // Every kind of enemy has a row of its own with its own levels, most numerous first; a place whose enemies have no kind in the records has the one row (WO-185 Part 4).
  const kinds = garrison ? war!.kinds : a?.kinds;
  const foeRows = levels ? (kinds?.length ? kinds.map((k) => ({ name: PLURAL[k.kind] ?? `${k.kind}s`, range: k.range ?? levels })) : [{ name: foes, range: levels }]) : [];

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
  // A realm with no place on Tamriel's map (the Soul Cairn) says what it is and how you get there (WO-178), and has no levels gauge: its scale is not the land's. Its danger is said once (WO-178 Part 3): the foe lines under the cell, never "isn't known" beside a level.
  const realm = !place.pos && !place.inTown && !!place.gettingThere;
  // How dangerous it is, when not known, is said once, under Not sure yet; a place that page doesn't list keeps its band cell (WO-180 Part 5b).
  const dangerUnsure = !levels && a?.hostile !== false && !realm && placeKind(place) === "dangerous";
  const lede = `${/^[AEIOU]/i.test(type) ? "An" : "A"} ${kind}${near ? ` ${near}` : place.realm ? ` in ${place.realm.replace(/^The /, "the ")}` : place.hold ? ` in ${holdWords(place.hold)}` : ""}.${realm ? ` ${place.gettingThere}.` : ""}${boss ? ` Its boss is ${boss.name}.` : ""}`.replace(/\s+/g, " ");
  const lived = placeKind(place) !== "dangerous";
  const ic = (
    <InformationConfidence
      id="sure"
      line="Counted from the game files."
      sources={[
        { mark: "yes", name: "LoreRim's game files", note: lived ? "Who lives here, what they sell and teach, books, crafting and XP, read from the records" : "Who lives here, the boss, books, crafting and XP, read from the records" },
        confirmed.names.length
          ? { mark: "yes", name: "Players", note: `Confirmed by ${confirmed.names.length} ${confirmed.names.length === 1 ? "player" : "players"}`, names: x.names }
          : { mark: "no", name: "Players", note: "No reports. No one has confirmed this page yet." },
      ]}
      unsure={placeUnsure(place)}
      know={x.know}
      actions={
        <>
          {x.beacon}
          <ConfirmButton kind="place" id={slug} path={`/places/${slug}`} title={placeLabel(place)} signedIn={!!userId} mine={confirmed.mine} signIn={<SignInButton redirectTo={`/places/${slug}`} className="btn btn-primary" label="Sign in to confirm" />} />
          <ReportMistake kind="place" pageKey={slug} what="place" shots={x.reportable} signedIn={!!userId} signIn={<SignInButton redirectTo={`/places/${slug}`} className="btn" label="Sign in to report a mistake" />} />
        </>
      }
    />
  );
  const pkind = placeKind(place);
  if (pkind !== "dangerous") {
    const goodToKnow: [string, string][] = [
      ...(place.inTown ? ([["In", place.inTown]] as [string, string][]) : []),
      ...(place.hold ? ([["Hold", `${holdWords(place.hold)}`]] as [string, string][]) : []),
      ...(town ? ([["Nearest town", `${town.town}${town.walk ? `, ${town.walk}` : ""}`]] as [string, string][]) : []),
    ];
    return <PlaceTown place={place} kind={pkind} origin={origin} near={near} ic={ic} goodToKnow={goodToKnow} />;
  }
  const tick = (n: number) => (n === 1 ? "Level 1" : String(n));

  // At a glance (WO-162, the colours of rule 34): danger in red, the boss and people in orange, what it pays in gold, when it comes back, and the nearest town in teal.
  const glance: { key: string; icon: string; tone: string; label: string; value: React.ReactNode; sub?: React.ReactNode }[] = [
    ...(levels ? [{ key: "danger", icon: "tab-levels", tone: l.cRed, label: "Danger", value: levelRange(levels), sub: `${foes}${alsoHere?.length ? `, ${alsoHere.map((x) => PLURAL[x] ?? `${x}s`).join(", ")} too` : ""}` }] : a?.hostile === false ? [{ key: "danger", icon: "tab-levels", tone: l.cRed, label: "Danger", value: "None", sub: "Nobody here is hostile" }] : dangerUnsure ? (place.danger?.traps ? [{ key: "danger", icon: "tab-levels", tone: l.cRed, label: "Danger", value: "Traps", sub: undefined }] : []) : [{ key: "danger", icon: "tab-levels", tone: l.cRed, label: "Danger", value: "Not known yet", sub: undefined }]),
    ...(boss ? [{ key: "boss", icon: "quest-people", tone: l.cOrange, label: "The boss", value: personHref(boss.name) ? <PreviewLink href={personHref(boss.name)!}>{boss.name}</PreviewLink> : boss.name, sub: boss.words ? `Level ${boss.words}` : undefined }] : []),
    ...(place.clearXp || place.discoveryXp ? [{ key: "xp", icon: "quest-rewards", tone: l.cGold, label: "Rewards", value: `${place.clearXp || place.discoveryXp} XP`, sub: [place.clearXp ? "For clearing it" : "", place.discoveryXp && place.clearXp ? `${place.discoveryXp} XP for finding it` : place.discoveryXp ? "For finding it" : ""].filter(Boolean).join("; ") }] : []),
    ...(place.respawns ? [{ key: "back", icon: "tab-set-up", tone: l.cOrange, label: "Comes back", value: respawnWords(place.respawns), sub: undefined }] : []),
    ...(town ? [{ key: "town", icon: "quest-travel", tone: l.cTeal, label: "Nearest town", value: town.town, sub: town.walk ? town.walk.charAt(0).toUpperCase() + town.walk.slice(1) : undefined }] : []),
  ];

  return (
    <main className={l.root}>
      <ShotHero kind="place" slug={slug}>
      <div className={`page ${l.top}`}>
      <PageTop back={{ href: "/places", label: "Places" }} />

      <TitleBox
        title={placeLabel(place)}
        tags={
          <>
            <span className={l.tagPlain}>{placeType(place.type)}</span>
            {place.hold && <span className={l.tagPlace}>{holdWords(place.hold)}</span>}
            {place.realm && !place.hold && <span className={l.tagPlace}>{place.realm}</span>}
            {origin && <span className={l.tagPlain}>{origin}</span>}
          </>
        }
      />

      <p className={styles.lede}>{lede}</p>
      </div>
      </ShotHero>

      <PlaceMapBand place={place} />

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
          {/* A place with little known says what the lede and the band don't, in one short block, not an empty page (WO-180); the kind, the hold and the
              XP for finding it are theirs already (WO-180 Part 6b: Moss Mother Cavern's block said the lede again). */}
          {!levels && a?.hostile !== false && !hasWorth && quests.length === 0 && place.danger?.traps && (
            <section id="known" className={styles.sec} aria-label="What is known">
              <p className={styles.way}>It has traps.</p>
            </section>
          )}
          {(levels || a?.hostile === false || (place.danger?.traps && !dangerUnsure && (hasWorth || quests.length > 0))) && (
          <section id="danger" className={styles.sec} aria-label="Danger">
            {levels ? (
              <>
                {!realm && (
                  <>
                <div
                  className={styles.gauge}
                  style={{ gridTemplateRows: `repeat(${foeRows.length + (boss?.range ? 1 : 0)}, 26px)` }}
                  role="img"
                  aria-label={`${foeRows.map((r) => `${r.name} from level ${r.range[0]} to ${r.range[1]}`).join("; ")}${boss?.range ? `; the boss from level ${boss.range[0]} to ${boss.range[1]}` : ""}, on a scale of 1 to 50`}
                >
                  {foeRows.map((r, i) => (
                    <span key={r.name} className={`${styles.band} ${r.range[1] > 36 ? styles.bandLeft : ""}`} style={{ gridColumn: `${Math.min(r.range[0], 50)} / ${Math.min(r.range[1], 50) + 1}`, gridRow: i + 1 }}>
                      {r.name} {r.range[0] === r.range[1] ? r.range[0] : `${r.range[0]} to ${r.range[1]}`}
                    </span>
                  ))}
                  {boss?.range && (
                    <span className={`${styles.band} ${styles.bandBoss} ${boss.range[1] > 36 ? styles.bandLeft : ""}`} style={{ gridColumn: `${Math.min(boss.range[0], 50)} / ${Math.min(boss.range[1], 50) + 1}`, gridRow: foeRows.length + 1 }}>
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
                  </>
                )}
                <div style={{ paddingTop: 8 }}>
                  {foeRows.map((r) => (
                    <div key={r.name} className={styles.foe}>
                      <b>{r.name}</b>
                      <span className={styles.lv}>{r.range[0] === r.range[1] ? `Level ${r.range[0]}` : `Level ${r.range[0]} to ${r.range[1]}`}</span>
                    </div>
                  ))}
                  {war && !garrison && (
                    <div className={styles.foe}>
                      <b>After the war</b>
                      <span className={styles.lv}>{war.range[0] === war.range[1] ? `Level ${war.range[0]}` : `Level ${war.range[0]} to ${war.range[1]}`}</span>
                      <small>{war.count} in all.</small>
                    </div>
                  )}
                  {boss && (
                    <div className={`${styles.foe} ${styles.foeBoss}`}>
                      <b>
                        The boss: {personHref(boss.name) ? <PreviewLink href={personHref(boss.name)!}>{boss.name}</PreviewLink> : boss.name}
                      </b>
                      {boss.words ? <span className={styles.lv}>Level {boss.words}</span> : null}
                    </div>
                  )}
                  {inAll ? <p className={styles.way}>{inAll} in all.</p> : null}
                </div>
              </>
            ) : a?.hostile === false ? (
              <p className={styles.way}>Nobody here is hostile.</p>
            ) : null}
            {place.danger?.traps && (
              <div className={styles.flag}>
                <b>!</b>
                <span>Traps</span>
              </div>
            )}
          </section>
          )}

          {hasWorth && (
            <Section id="worth" icon="mark-skill-book" title="Worth going for">
              {worth?.skillBooks?.map((b) => (
                <div key={b} className={styles.worth}>
                  <Icon name="mark-skill-book" />
                  <b>{b.includes(": ") ? b.split(": ")[1] : b}</b>
                  <small>{b.includes(": ") ? `${/^[aeiou]/i.test(b) ? "An" : "A"} ${b.split(": ")[0]} skill book` : "A skill book"}</small>
                </div>
              ))}
              {worth?.wordWall?.map((w) => (
                <div key={w} className={styles.worth}>
                  <Icon name="quest-sure" />
                  <b>{w}</b>
                  <small>A word wall</small>
                </div>
              ))}
              {worth?.bossChest && (
                <div className={styles.worth}>
                  <Icon name="quest-chest" />
                  <b>A boss chest</b>
                </div>
              )}
              {worth?.shrines?.map((s) => (
                <div key={s} className={styles.worth}>
                  <Icon name="quest-sure" />
                  <b>{s}</b>
                  <small>A shrine</small>
                </div>
              ))}
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

        </div>

        <aside className={styles.side}>
          <LineToc
            items={[
              ...(hasWorth ? [{ id: "worth", label: "Worth going for", icon: "mark-skill-book" }] : []),
              ...(quests.length ? [{ id: "quests", label: "Quests that bring you here", icon: "tab-play" }] : []),
              { id: "shots", label: "Screenshots", icon: "tab-play" },
              { id: "sure", label: "Information Confidence", icon: "quest-sure" },
            ]}
          />
        </aside>
      </div>

      <div className="page">
        <ShotsSection kind="place" slug={slug} name={placeLabel(place)} back={`/places/${slug}`} />
      </div>

      <div className={`page ${l.foot}`}>{ic}</div>
    </main>
  );
}
