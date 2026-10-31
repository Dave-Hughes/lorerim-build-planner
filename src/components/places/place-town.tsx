/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import { Linked } from "@/components/pages/linked";
import { PageTop, TitleBox } from "@/components/pages/page-kit";
import { PreviewLink } from "@/components/pages/preview-link";
import { LineToc } from "@/components/quests/line-parts";
import { PlaceMapBand } from "./place-map";
import { ShotHero } from "@/components/screenshots/shot-hero";
import { ShotsSection } from "@/components/screenshots/shots-section";
import { linkable } from "@/lib/pages/names";
import { placeHref, placeHrefOf, placeLabel, placeSlug, placeType, rangeOf, type Place } from "@/lib/places/data";
import { closeBy, innsOf, peopleAt, shopsOf, type PlacePerson, type Shop } from "@/lib/places/people";
import type { PlaceKind } from "@/lib/places/kind";
import { questHref } from "@/lib/quests/slugs";
import { questsData } from "@/lib/quests/data";
import { pageOf } from "@/lib/quests/reads";
import { playerFacing } from "@/lib/places/said";
import l from "@/components/quests/line-page.module.css";
import t from "./place-town.module.css";
import { holdWords } from "@/lib/places/hold-words";

const ICON = { sells: "quest-rewards", trains: "tab-levels", follower: "quest-people", rents: "quest-travel", quests: "quest-side-stories" } as const;

/** "Level 6 to 20", or "Level 14 and up" when the records give no top (a leveled creature with no ceiling). */
export const levelRange = ([lo, hi]: [number, number]) => (hi >= 100 ? `Level ${lo} and up` : lo === hi ? `Level ${lo}` : `Level ${lo} to ${hi}`);

const PLURAL: Record<string, string> = { Bandit: "Bandits", Draugr: "Draugr", Skeleton: "Skeletons", Falmer: "Falmer", Forsworn: "Forsworn", Giant: "Giants", Warlock: "Warlocks", Spider: "Spiders", Wolf: "Wolves", Vampire: "Vampires", Troll: "Trolls" };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Person({ p }: { p: PlacePerson }) {
  return (
    <span className={t.p}>
      <Link href={p.href}>{p.name}</Link>
      {p.role && <span className={t.role}>{p.role}</span>}
      {p.chips.map((c) => (
        <span key={c.text} className={`${t.chip} ${t[c.kind]}`}>
          <img className={t.px} src={`/icons/${ICON[c.kind]}.svg`} alt="" width={14} height={14} />
          {c.text}
        </span>
      ))}
    </span>
  );
}

const NUMBER_WORD: Record<number, string> = { 2: "two", 3: "three", 4: "four", 5: "five", 6: "six" };

const list = (xs: string[]) => (xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

/**
 * A place people live (WO-162, PlaceTown): a town, or an inn, temple or hall inside one. A summary built from the data; At a glance (where,
 * people, shops and beds, trainers and followers, what finding it pays: no danger, no boss, no clearing); who lives here by the building they
 * sleep in; the quests that bring you here; the dangerous places nearby; what you can make and the shrines; what people say. An inside place
 * is the same page, smaller, with its keeper first and a link up to its town.
 */
export function PlaceTown({ place, kind, origin, near, ic, goodToKnow }: { place: Place; kind: Exclude<PlaceKind, "dangerous">; origin: string | null; near: string | null; ic: ReactNode; goodToKnow: [string, string][] }) {
  const inside = kind === "inside";
  const { houses, total } = peopleAt(place);
  const everyone = houses.flatMap((h) => h.people);
  // (the game's own innkeeper first, who rents the rooms; then the one the read names)
  const keepers = everyone.filter((p) => p.keeper).sort((a, b) => Number(b.recordKeeper) - Number(a.recordKeeper) || b.keeperRank - a.keeperRank);
  const shops = shopsOf(houses, inside ? place.inTown : place.name);
  const inns = innsOf(houses);
  // A town has beds when one of its inns does; an inn, temple or hall has them when its keeper does.
  const beds = inside ? keepers.length : inns.length;
  const trainers = everyone.filter((p) => p.trains);
  const followers = everyone.filter((p) => p.follower);
  const names = linkable();
  const upHref = place.inTown ? placeHref(place.inTown) : null;

  // The place's quests, with who gives each and the bookkeeping left out.
  const byName = new Map(questsData().lines.flatMap((x) => x.quests.map((q) => [q.name, q] as const)));
  const quests = (place.quests ?? []).flatMap((name) => {
    const q = byName.get(name);
    const href = q ? questHref(q.edid) : null;
    if (!q || !href || !playerFacing(name)) return [];
    const page = pageOf(q);
    const giver = page.starts.find((s) => s.who)?.who;
    const says = page.takesYou.find((x) => x.place.toLowerCase() === place.name.toLowerCase())?.why;
    return [{ name, href, sub: giver ? `from ${giver}` : says ? cap(says) : null }];
  });
  const close = inside ? [] : closeBy(place);
  const worth = place.worthGoingFor;
  const crafting = worth?.crafting ?? [];
  const shrines = worth?.shrines ?? [];
  // What places.json holds for the place and a page didn't show (WO-183 Part 4): its skill books and a word wall.
  const books = worth?.skillBooks ?? [];
  const walls = worth?.wordWall ?? [];

  // The page's own words: a summary from what is known.
  const typeWords = placeType(place.type).toLowerCase().replace(/^stables$/, "stable");
  const bits = [
    shops.length ? list([...new Set(shops.map((s) => s.kind).filter((x) => x !== "goods"))].slice(0, 2)) : "",
    beds ? (inside ? "rooms to rent" : inns.length > 1 ? `${NUMBER_WORD[inns.length] ?? inns.length} inns` : "an inn") : "",
    trainers.length ? `${list([...new Set(trainers.map((x) => x.trains!.toLowerCase()))])} trainers` : "",
  ].filter(Boolean);
  const pitch = [
    `${/^[aeiou]/.test(typeWords) ? "An" : "A"} ${typeWords}${inside && place.inTown ? ` in ${place.inTown}` : place.hold ? ` in ${holdWords(place.hold)}` : ""}${near && !inside ? `, ${near}` : ""}.`,
    total ? `${total === 1 ? "One person lives" : `${total} people ${inside ? "are" : "live"}`} here${bits.length ? `, with ${list(bits)}` : ""}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cell = (key: string, icon: string, tone: string, label: string, value: ReactNode, sub?: ReactNode, small?: boolean) => (
    <div key={key} className={l.gl}>
      <span className={`${l.k} ${tone}`}>
        <img className={l.px} src={`/icons/${icon}.svg`} alt="" width={18} height={18} />
        {label}
      </span>
      <span className={`${l.v} ${small ? l.vSmall : ""}`}>{value}</span>
      {sub ? <span className={l.s}>{sub}</span> : null}
    </div>
  );
  const staffLinks = (s: Shop) =>
    s.staff.slice(0, 2).map((x, i) => (
      <span key={x.name}>
        {i ? ", " : ""}
        <Link href={x.href}>{x.name}</Link>
      </span>
    ));
  const shopLine = (s: Shop) => (
    <span key={s.name} style={{ display: "block" }}>
      {s.noun && s.cell ? (
        // a seller who works from a home, a keep or a hall: said once, "Endon, silversmith (Endon's House)"; the assistants in the same bracket
        <>
          <Link href={s.keeper.href}>{s.keeper.name}</Link>, {s.kind} ({s.href ? <Link href={s.href}>{s.cell}</Link> : s.cell}
          {s.staff.length > 0 && <>, with {staffLinks(s)}</>})
        </>
      ) : s.noun ? (
        <>
          <Link href={s.keeper.href}>{s.keeper.name}</Link>&apos;s {s.noun}: {s.kind}
        </>
      ) : (
        <>
          {s.href ? <Link href={s.href}>{s.name}</Link> : s.name}: <Link href={s.keeper.href}>{s.keeper.name}</Link>, {s.kind}
        </>
      )}
      {s.staff.length > 0 && !(s.noun && s.cell) && <> (with {staffLinks(s)})</>}
    </span>
  );
  const nameLinks = (ps: PlacePerson[], max = 3) =>
    ps.slice(0, max).map((p, i) => (
      <span key={p.name}>
        {i ? ", " : ""}
        <Link href={p.href}>{p.name}</Link>
      </span>
    ));
  const cells: ReactNode[] = [
    cell("where", "quest-travel", l.cTeal, "Where", inside ? (place.inTown ?? place.hold ?? "In a town") : place.hold ? `${holdWords(place.hold)}` : placeType(place.type), inside ? (upHref && place.inTown ? <PreviewLink href={upHref}>{`In ${place.inTown}`}</PreviewLink> : place.hold ? `${holdWords(place.hold)}` : null) : near ? cap(near) : null),
    ...(total ? [cell("people", "quest-people", l.cOrange, "People", String(total), houses.length === 1 ? undefined : `in ${houses.filter((h) => h.name !== place.name).length || houses.length} homes and buildings`)] : []),
    ...(shops.length || beds
      ? [
          cell(
            "shops",
            "quest-rewards",
            l.cGold,
            "Shops and beds",
            cap(list([shops.length ? `${shops.length} ${shops.length === 1 ? "shop" : "shops"}` : "", beds ? (inns.length > 1 ? `${inns.length} inns with rooms` : "an inn with rooms") : ""].filter(Boolean))),
            // One line per shop: its name, its keeper and what it sells (the rest open under "and N more"); then the inns and who keeps each.
            <>
              {shops.slice(0, 6).map((s) => shopLine(s))}
              {shops.length > 6 && (
                <details>
                  <summary>and {shops.length - 6} more</summary>
                  {shops.slice(6).map((s) => shopLine(s))}
                </details>
              )}
              {inns.map((h) => {
                const keeper = h.people.find((p) => p.keeper)!;
                return (
                  <span key={h.name} style={{ display: "block" }}>
                    {h.href ? <Link href={h.href}>{h.name}</Link> : h.name}: <Link href={keeper.href}>{keeper.name}</Link>, rooms to rent
                  </span>
                );
              })}
            </>,
            true,
          ),
        ]
      : []),
    ...(trainers.length || followers.length
      ? [
          cell(
            "trainers",
            "tab-levels",
            l.cGreen,
            "Trainers and followers",
            list([...new Set(trainers.map((x) => x.trains!))]) || "Followers",
            // Who does what: "Faendal trains Marksman" and, apart, "Followers: Faendal, Sven" (WO-177: a list of names under a skill read as all training it).
            <>
              {trainers.map((x) => (
                <span key={x.name} style={{ display: "block" }}>
                  <Link href={x.href}>{x.name}</Link> trains {x.trains}.
                </span>
              ))}
              {followers.length > 0 && (
                <span style={{ display: "block" }}>
                  {trainers.length > 0 ? `${followers.length === 1 ? "Follower" : "Followers"}: ` : ""}
                  {nameLinks(followers, 3)}
                </span>
              )}
            </>,
            true,
          ),
        ]
      : []),
    ...(!inside && place.actors?.livesHere && place.actors.hostile !== false
      ? [cell("path", "tab-levels", l.cRed, "On the way up", `${PLURAL[place.actors.livesHere] ?? `${place.actors.livesHere}s`} on the path up`, place.actors.floor !== undefined || place.actors.atLevel?.length ? levelRange(rangeOf(place.actors)).toLowerCase() : null, true)]
      : []),
    ...(crafting.length && inside ? [cell("make", "smithing", l.cGold, "What you can make", cap(crafting.join(", ").replace(/, ([^,]*)$/, " and $1").replace(/\ban? /g, "")), null, true)] : []),
    ...(place.discoveryXp ? [cell("xp", "quest-rewards", l.cGold, "Finding it", `${place.discoveryXp} XP`, "For finding it")] : []),
  ];

  const toc = [
    ...(houses.length ? [{ id: "people", label: inside ? "Who is here" : "Who lives here", icon: "quest-people" }] : []),
    ...(quests.length ? [{ id: "quests", label: "Quests that bring you here", icon: "tab-play" }] : []),
    ...(close.length ? [{ id: "close", label: "Close by", icon: "quest-ways" }] : []),
    ...(crafting.length || shrines.length || books.length || walls.length ? [{ id: "craft", label: "Books, crafting and shrines", icon: "quest-rewards" }] : []),
    { id: "shots", label: "Screenshots", icon: "tab-play" },
    { id: "sure", label: "Information Confidence", icon: "quest-sure" },
  ];

  return (
    <main className={l.root}>
      <ShotHero kind="place" slug={placeSlug(place)}>
      <div className={`page ${l.top}`}>
        <PageTop back={inside && upHref && place.inTown ? { href: upHref, label: place.inTown } : { href: "/places", label: "Places" }} />
        <TitleBox
          title={placeLabel(place)}
          tags={
            <>
              <span className={l.tagPlain}>{placeType(place.type)}</span>
              {place.hold && <span className={l.tagPlace}>{holdWords(place.hold)}</span>}
              {origin && <span className={l.tagPlain}>{origin}</span>}
            </>
          }
        />
        <p className={l.pitch}>{pitch}</p>
      </div>
      </ShotHero>

      <PlaceMapBand place={place} />

      <section className={l.band} aria-label="At a glance">
        <div className={`page ${l.glance}`} style={{ "--cols": cells.length } as React.CSSProperties}>
          {cells}
        </div>
      </section>

      <div className={`page ${l.cols}`}>
        <div className={l.main}>
          {houses.length > 0 && (
            <section className={l.sec} id="people" aria-labelledby="people-h">
              <div className={l.sechd}>
                <h2 id="people-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-people.svg" alt="" width={30} height={30} />
                  {inside ? "Who is here" : "Who lives here"}
                </h2>
                <span className={l.cap}>{inside ? "The keeper first" : "By where they sleep"}</span>
              </div>
              {houses.map((h) => (
                <div key={h.name} className={`${t.house} ${houses.length === 1 ? t.houseSolo : ""}`}>
                  {houses.length === 1 ? null : h.name !== place.name ? (
                    <b className={t.houseName}>
                      <img className={t.px} src="/icons/quest-travel.svg" alt="" width={18} height={18} />
                      {h.href ? <Link href={h.href}>{h.name}</Link> : h.name}
                    </b>
                  ) : (
                    <span />
                  )}
                  <div className={t.ppl}>
                    {h.people.map((p) => (
                      <Person key={p.name} p={p} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {quests.length > 0 && (
            <section className={l.sec} id="quests" aria-labelledby="quests-h">
              <div className={l.sechd}>
                <h2 id="quests-h" className={l.h2}>
                  <img className={l.px} src="/icons/tab-play.svg" alt="" width={30} height={30} />
                  Quests that bring you here
                </h2>
                <span className={l.cap}>
                  {quests.length} quest{quests.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className={t.list2}>
                {quests.map((q) => (
                  <div key={q.href} className={t.row}>
                    <img className={t.px} src="/icons/quest-side-stories.svg" alt="" width={22} height={22} />
                    <span>
                      <Link href={q.href}>{q.name}</Link>
                      {q.sub && (
                        <span className={t.w}>
                          <Linked text={q.sub} names={names} />
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {close.length > 0 && (
            <section className={l.sec} id="close" aria-labelledby="close-h">
              <div className={l.sechd}>
                <h2 id="close-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-ways.svg" alt="" width={30} height={30} />
                  Close by
                </h2>
                <span className={l.cap}>Danger is the level range inside</span>
              </div>
              <div className={t.list2}>
                {close.map(({ place: p, range, words }) => (
                  <div key={p.id} className={t.row}>
                    <img className={t.px} src="/icons/quest-travel.svg" alt="" width={22} height={22} />
                    <span>
                      <PreviewLink href={placeHrefOf(p)}>{placeLabel(p)}</PreviewLink>
                      <span className={t.w}>
                        {placeType(p.type)}, {words}
                      </span>
                    </span>
                    {range && <span className={t.lv}>{levelRange(range)}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(crafting.length > 0 || shrines.length > 0 || books.length > 0 || walls.length > 0) && (
            <section className={l.sec} id="craft" aria-labelledby="craft-h">
              <div className={l.sechd}>
                <h2 id="craft-h" className={l.h2}>
                  <img className={l.px} src="/icons/quest-rewards.svg" alt="" width={30} height={30} />
                  Books, crafting and shrines
                </h2>
              </div>
              <div className={t.list2}>
                {books.map((b) => (
                  <div key={b} className={t.row}>
                    <img className={t.px} src="/icons/mark-skill-book.svg" alt="" width={22} height={22} />
                    {b.includes(": ") ? `${b.split(": ")[1]}, ${/^[aeiou]/i.test(b) ? "an" : "a"} ${b.split(": ")[0]} skill book` : `${b}, a skill book`}
                  </div>
                ))}
                {walls.map((w) => (
                  <div key={w} className={t.row}>
                    <img className={t.px} src="/icons/quest-sure.svg" alt="" width={22} height={22} />
                    {w}, a word wall
                  </div>
                ))}
                {crafting.length > 0 && (
                  <div className={t.row}>
                    <img className={t.px} src="/icons/smithing.svg" alt="" width={22} height={22} />
                    {cap(list(crafting))}
                  </div>
                )}
                {shrines.length > 0 && (
                  <div className={t.row}>
                    <img className={t.px} src="/icons/quest-sure.svg" alt="" width={22} height={22} />
                    {cap(list(shrines.map((s) => s.replace(/^Shrine of /, ""))).replace(/^(.)/, "$1")).replace(/^/, "Shrines of ")}
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

        <aside className={l.rail}>
          <LineToc items={toc} />
          {goodToKnow.length > 0 && (
            <div>
              <h3 className={l.rh}>Good to know</h3>
              <div className={t.kv}>
                {goodToKnow.flatMap(([k, v]) => [<span key={`${k}k`}>{k}</span>, <span key={`${k}v`}>{v}</span>])}
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="page">
        <ShotsSection kind="place" slug={placeSlug(place)} name={placeLabel(place)} back={`/places/${placeSlug(place)}`} />
      </div>

      <div className={`page ${l.foot}`}>
        {ic}
      </div>
    </main>
  );
}
