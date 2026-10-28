/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConfirmButton } from "@/components/pages/confirm-button";
import { Linked } from "@/components/pages/linked";
import { PreviewLink } from "@/components/pages/preview-link";
import { confirmationsOf } from "@/lib/quests/confirmations";
import {
  Gold,
  InformationConfidence,
  NotKnown,
  PageTop,
  Panel,
  Section,
  TitleBox,
  type SureSource,
} from "@/components/pages/page-kit";
import { Steps } from "@/components/pages/steps";
import { QuestReport } from "@/components/quests/quest-report";
import { SignInButton } from "@/components/site-header";
import { linkable, modNames, personNames } from "@/lib/pages/names";
import { GlanceBand, type GlanceCell } from "@/components/pages/glance";
import { AutoToc } from "@/components/pages/auto-toc";
import l from "@/components/quests/line-page.module.css";
import { placeOnly, vaguePlace } from "@/lib/pages/where";
import { categories, homeName, questsData } from "@/lib/quests/data";
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import { dangerParts, pageOf, placeNamed, playersWords } from "@/lib/quests/reads";
import { questBySlug, questHref } from "@/lib/quests/slugs";
import { placeHref, type Place } from "@/lib/places/data";
import { placeKind } from "@/lib/places/kind";
import { personHref } from "@/lib/people/data";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  await loadPlayerFacts();
  const found = questBySlug((await params).slug);
  if (!found) return {};
  const { line, quest } = found;
  const name = quest.name || quest.edid;
  return {
    // The line only when it adds something (WO-161): a quest that is its own line isn't named twice.
    title: line.quests.length > 1 && line.name !== name ? `${name} | ${line.name}` : name,
    ...siteMetadata(
      questHref(quest.edid) ?? "/quests",
      quest.name || quest.edid,
      quest.start?.then ?? line.begins ?? homeName(line.category),
    ),
  };
}

const nexus = (id: string) =>
  `https://www.nexusmods.com/skyrimspecialedition/mods/${id}`;

/**
 * A quest's own page (WO-154 Part 2), from the canvas board "Quest page: Lights Out!, second pass": the title box with where it is and
 * what changed it, how to start it, N ways to finish it, where it takes you; rewards and people at the side; what it closes and how sure
 * we are at the foot. (A quest's page never speaks of a player's character or run, Dave 27 Oct: whether a quest is open for someone is the connector's to say, to their assistant.) Its back button goes to the page the visitor came from, or to the quest's category when they came from outside (WO-159).
 */
export default async function QuestPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ report?: string }>;
}) {
  await loadPlayerFacts();
  const slug = (await params).slug;
  const found = questBySlug(slug);
  if (!found) notFound();
  const { line, quest } = found;
  const reporting = (await searchParams).report === "1";
  const userId = (await auth())?.user?.id ?? null;
  const name = quest.name || quest.edid;
  const start = quest.start;
  const home = questsData().categories[line.category]
    ? categories().find((c) => c.key === line.category)!
    : null;
  const page = pageOf(quest);
  const reads = page.source === "reads";
  const town = line.where ?? start?.towns?.[0] ?? null;
  const mod = quest.mod ?? line.sources[0];
  const changed = quest.changedBy ?? [];

  // The people and places the page names, as links.
  // A giver written as "Gerdur, Hilde, Frodnar or Delphine" is four people; one written as "bandits in Bleak Falls Barrow" is a group, not a person
  // (WO-165 review): split it, keep the parts that have a person page, and list each person once.
  const people = [
    ...new Map(
      [
        ...page.people,
        ...page.starts
          .filter((s) => s.who)
          .flatMap((s) => s.who!.split(/\s*,\s*|\s+(?:or|and)\s+/).map((w) => w.replace(/^the\s+/i, "").trim()))
          .filter((w) => w && personHref(w))
          .map((name) => ({ name, role: undefined as string | undefined })),
      ].map((p) => [p.name.toLowerCase(), p] as const),
    ).values(),
  ];
  // Mods first, so a place or a person of the same name wins the link.
  const names = [
    ...modNames(),
    ...linkable(),
    ...personNames(people.map((p) => p.name)),
  ];

  const ways = page.ways;
  // Choices that add no steps of their own (the match in The Book of Love): not "ways to finish it", but the steps and then the choices.
  const choicesOnly =
    !!ways &&
    ways.shape === "endings" &&
    ways.ways.every((w) => w.steps.length === 0);
  const stepsHere = page.steps.filter((s) => s.objectives.length);
  const askedCanDo =
    page.canDo && page.canDo.label !== "Talk to someone to start it"
      ? page.canDo
      : null;

  // How sure we are: a tick per source.
  const reported = (start?.ways ?? []).filter((w) => w.checked === "players");
  // No player's name on a page (WO-154 Part 4): a report is "a player's report"; only a confirmation shows the Discord name its player chose.
  const reporters = page.reports;
  const confirmed = await confirmationsOf("quest", quest.edid, userId);
  const sources: SureSource[] = [
    reads
      ? {
          mark: "yes",
          name: "LoreRim's game files",
          note: "Read, then checked by a second reader",
        }
      : {
          mark: "part",
          name: "LoreRim's game files",
          note: "From the planner's older rules. Not read by a reader yet",
        },
    // UESP is the Elder Scrolls wiki; it links to the quest's page there when the answer key has one (WO-154 Part 4).
    start?.checked === "uesp"
      ? {
          mark: "part",
          name: "UESP (the Elder Scrolls wiki)",
          ...(start.url ? { href: start.url } : {}),
          note: "Confirms who starts it",
        }
      : {
          mark: "no",
          name: "UESP (the Elder Scrolls wiki)",
          note: "Not compared yet",
        },
    reporters || confirmed.names.length
      ? {
          mark: "yes",
          name: "Players",
          note: [
            reporters ? playersWords(reporters) : "",
            confirmed.names.length
              ? `Confirmed by ${confirmed.names.length} ${confirmed.names.length === 1 ? "player" : "players"}`
              : "",
          ]
            .filter(Boolean)
            .join(". "),
          names: confirmed.names.map((r) => <span key={r}>{r}</span>),
        }
      : {
          mark: "no",
          name: "Players",
          note: "No reports. No one has confirmed this page yet.",
        },
  ];
  const sureLine = page.sure.replace(/\.?\s*Unsure: .*$/, "");

  // At a glance (WO-165, the colours of rule 34): how it starts (green), level and danger (red), where it takes you (teal), what it pays (gold), and the ways to finish it (violet).
  const first = page.starts[0];
  const startWho = first?.who;
  const startPlace = first && !vaguePlace(first.where) ? placeOnly(first.where) : undefined;
  const levelNeed = page.needs.map((n) => /\bLevel (\d+)/i.exec(n.text)?.[1]).find(Boolean);
  const danger = page.takesYou.find((t) => t.danger);
  const wayCount = ways && !choicesOnly ? ways.ways.length : 0;
  const cell = (c: GlanceCell | null) => c;
  const cells = [
    cell({
      key: "start",
      icon: "quest-sure",
      tone: "green",
      label: "How it starts",
      value: startWho ? <Linked names={names} text={startWho} /> : (page.canDo?.label ?? "Not known yet"),
      sub: startPlace ? <Linked names={names} text={startPlace} /> : first?.how && first.how.length <= 110 ? <Linked names={names} text={first.how} /> : undefined,
      small: !startWho,
    }),
    cell({ key: "level", icon: "tab-levels", tone: "red", label: "Level and danger", value: levelNeed ? `Level ${levelNeed}` : "Any level", sub: danger ? `${danger.place}: ${danger.danger}` : undefined }),
    page.takesYou.length
      ? cell({ key: "where", icon: "quest-travel", tone: "teal", label: "Where it takes you", value: <Linked names={names} text={page.takesYou.slice(0, 2).map((t) => t.place).join(", ")} />, sub: page.takesYou.length > 2 ? `and ${page.takesYou.length - 2} more` : undefined, small: true })
      : null,
    cell({ key: "xp", icon: "quest-rewards", tone: "gold", label: "Rewards", value: page.gets.xp > 0 ? `${page.gets.xp.toLocaleString("en-US")} XP` : "No XP", sub: page.gets.rewards[0] ? page.gets.rewards[0].what.charAt(0).toUpperCase() + page.gets.rewards[0].what.slice(1) : undefined }),
    wayCount > 0 ? cell({ key: "ways", icon: "quest-ways", tone: "violet", label: "Ways to finish it", value: `${wayCount} ways`, sub: page.choices[0]?.choice }) : page.choices.length > 0 ? cell({ key: "ways", icon: "quest-ways", tone: "violet", label: "Choices", value: `${page.choices.length} ${page.choices.length === 1 ? "choice" : "choices"}`, sub: page.choices[0]?.choice }) : null,
  ].filter((c): c is GlanceCell => !!c);

  return (
    <main className={l.root}>
      <div className={`page ${l.top}`}>
      <PageTop
        back={home ? { href: `/quests/c/${home.slug}`, label: homeName(line.category) } : { href: `/quests/${line.id}`, label: line.name }}
      />

      <TitleBox
        title={name}
        tags={
          <>
            {line.quests.length > 1 && (
              <Link href={`/quests/${line.id}`} className={styles.tag}>
                {line.name}
              </Link>
            )}
            {town && <span className={styles.tag}>{town}</span>}
            {mod?.base ? (
              <span className={styles.tag}>Vanilla</span>
            ) : mod?.modid ? (
              <a
                href={nexus(mod.modid)}
                target="_blank"
                rel="noreferrer"
                className={styles.tag}
              >
                {mod.name} <span aria-hidden="true">&nbsp;↗</span>
              </a>
            ) : mod ? (
              <span className={styles.tag}>{mod.name}</span>
            ) : null}
            {changed.length > 0 && (
              <span className={styles.tagText}>
                Changed by{" "}
                {changed.map((m, i) => (
                  <span key={m.name}>
                    {i > 0 ? ", " : ""}
                    {m.modid ? (
                      <a href={nexus(m.modid)} target="_blank" rel="noreferrer">
                        {m.name} ↗
                      </a>
                    ) : (
                      m.name
                    )}
                  </span>
                ))}
              </span>
            )}
          </>
        }
      />

      </div>

      <GlanceBand cells={cells} />

      <div className={`page ${styles.main}`} style={{ paddingTop: 44 }}>
      {askedCanDo && (
        <Panel id="can-title" title="Can I do it?">
          <p className={styles.canDo}>
            {askedCanDo.label}
            {askedCanDo.why ? `: ${askedCanDo.why}` : ""}
          </p>
        </Panel>
      )}

      <div className={styles.cols}>
        <div className={styles.body}>
          <Section id="start" icon="speech" title="How to start it">
            {page.needs.length > 0 && (
              <>
                <h3 className={`${styles.needsHead}`}>What you need first</h3>
                <ul className={styles.needs} style={{ paddingTop: 8 }}>
                  {page.needs.map((n, i) => (
                    <li key={i}>
                      {n.href ? (
                        <PreviewLink href={n.href}>{n.text}</PreviewLink>
                      ) : (
                        <Linked names={names} text={n.text} />
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {page.starts.length ? (
              page.starts.map((w, i) => {
                // The place the read names, not its hours (WO-154 Part 4): where they are through the day is on their own page.
                const unknown = vaguePlace(w.where);
                const placeName = unknown ? undefined : placeOnly(w.where);
                // "bandits in Bleak Falls Barrow" already says where: the place isn't said twice.
                const where = placeName && w.who?.toLowerCase().includes(placeName.toLowerCase()) ? undefined : placeName;
                return (
                  <div key={i} className={styles.way}>
                    {/* Who, then where, then how (WO-154 Part 1b): the older rules' ways already say both in the how. */}
                    {reads &&
                    (w.who || where) &&
                    !(
                      w.who &&
                      w.how.includes(w.who) &&
                      (!where || w.how.includes(where.split(",")[0]))
                    ) ? (
                      <span className={styles.who}>
                        {w.who ? <Linked names={names} text={w.who} /> : null}
                        {where ? (
                          <span className={styles.at}>
                            {w.who ? " " : ""}
                            <Linked
                              names={names}
                              text={w.who ? `in ${where}` : `In ${where}`}
                            />
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    {unknown ? (
                      <NotKnown>Where: not known yet</NotKnown>
                    ) : null}
                    <p>
                      <Linked names={names} text={w.how} />
                      {w.whereIs?.length ? (
                        <span className="muted"> ({w.whereIs.join("; ")})</span>
                      ) : null}
                      {w.unplaced ? (
                        <span className="muted"> ({w.unplaced})</span>
                      ) : null}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className={styles.way}>
                <span className="muted">Its start isn&apos;t read yet.</span>
              </p>
            )}
            {!ways && page.firstStep && (
              <p className={styles.way}>
                <b>First step:</b>{" "}
                <Linked names={names} text={page.firstStep} />
                {!reads &&
                  start?.doors?.map((d) => (
                    <span key={d} className="muted">
                      {" "}
                      ({d.replace(/\.$/, "")})
                    </span>
                  ))}
              </p>
            )}
          </Section>

          {ways && choicesOnly ? (
            // The choices sit inside one list of steps and change nothing about how it ends (The Book of Love): the steps once, then the choices.
            <>
              <Section
                id="steps"
                icon="quest-ways"
                title="The steps"
                count="From the journal"
              >
                <div className={styles.wt}>
                  <span className={styles.wtTitle}>In order</span>
                  <div className={styles.wtBody}>
                    <Steps
                      items={ways.shared.map((t) => (
                        <Linked key={t} names={names} text={t} />
                      ))}
                    />
                  </div>
                </div>
              </Section>
              <Section id="choices" icon="quest-ways" title="The choices">
                {ways.ways.map((w, i) => (
                  <div key={i} className={styles.way}>
                    <span className={styles.who}>
                      <Linked names={names} text={w.title} />
                    </span>
                    {w.ends ? (
                      <p>
                        <Linked names={names} text={w.ends} />
                      </p>
                    ) : null}
                  </div>
                ))}
              </Section>
            </>
          ) : ways ? (
            <Section
              id="ways"
              icon="quest-ways"
              title={`${ways.ways.length} way${ways.ways.length === 1 ? "" : "s"} to finish it`}
              count="Steps from the journal"
            >
              {ways.shape === "endings" && ways.shared.length > 0 && (
                <>
                  <div className={styles.wt}>
                    <span className={styles.wtTitle}>
                      Every way takes these steps
                    </span>
                    <div className={styles.wtBody}>
                      <Steps
                        items={ways.shared.map((t) => (
                          <Linked key={t} names={names} text={t} />
                        ))}
                      />
                    </div>
                  </div>
                  <div className={styles.or} aria-hidden="true">
                    <span>then</span>
                  </div>
                </>
              )}
              {ways.ways.map((w, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div className={styles.or} aria-hidden="true">
                      <span>or</span>
                    </div>
                  )}
                  <div className={styles.wt}>
                    <span className={styles.wtTitle}>
                      <span className={styles.opt}>{i + 1}</span>
                      <Linked names={names} text={w.title} />
                    </span>
                    <div className={styles.wtBody}>
                      {w.ends ? (
                        <p>
                          <Linked names={names} text={w.ends} />
                        </p>
                      ) : null}
                      {w.steps.length > 0 && (
                        <Steps
                          items={w.steps.map((t, j) => (
                            <Linked key={j} names={names} text={t} />
                          ))}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          ) : (
            stepsHere.length > 0 && (
              <Section
                id="steps"
                icon="quest-ways"
                title="The steps"
                count="From the journal"
              >
                {stepsHere.map((st, i) => (
                  <div key={i} className={styles.wt}>
                    <span className={styles.wtTitle}>
                      {st.branch ??
                        (stepsHere.length > 1 ? "The rest" : "In order")}
                    </span>
                    <div className={styles.wtBody}>
                      <Steps
                        items={st.objectives.map((t, j) => (
                          <Linked key={j} names={names} text={t} />
                        ))}
                      />
                    </div>
                  </div>
                ))}
              </Section>
            )
          )}

          {page.takesYou.length > 0 &&
            (() => {
              const rows = page.takesYou.map((t) => ({
                t,
                place: vaguePlace(t.place) ? null : placeNamed(t.place),
              }));
              // When no place on the quest has danger data the column goes, and the page says so once (WO-154 Part 4).
              // A shop, inn, house or town has no danger (WO-162's kind decides): a row there has no danger cell.
              const hasDanger = (place: Place | null) => !place || placeKind(place) === "dangerous";
              const anyDanger = rows.some((r) => hasDanger(r.place) && dangerParts(r.place) !== null);
              return (
                <Section
                  id="takes"
                  icon="quest-travel"
                  title="Where it takes you"
                >
                  {rows.map(({ t, place }, i) => {
                    const href = place ? placeHref(place.name) : null;
                    const danger = dangerParts(place);
                    const unknown = vaguePlace(t.place);
                    const shownDanger = anyDanger && hasDanger(place);
                    return (
                      <div
                        key={i}
                        className={
                          shownDanger
                            ? styles.place
                            : `${styles.place} ${styles.placeAlone}`
                        }
                      >
                        <div className={styles.placeMain}>
                          <span className={styles.nm}>
                            {unknown ? (
                              <NotKnown>Where: not known yet</NotKnown>
                            ) : href ? (
                              <PreviewLink href={href}>{t.place}</PreviewLink>
                            ) : (
                              t.place
                            )}
                            {t.hold ? (
                              <span className={styles.hold}>{t.hold}</span>
                            ) : null}
                          </span>
                          {t.why ? (
                            <p>
                              <Linked
                                names={names}
                                text={
                                  t.why.charAt(0).toUpperCase() + t.why.slice(1)
                                }
                              />
                              {t.why.endsWith(".") ? "" : "."}
                            </p>
                          ) : null}
                        </div>
                        {shownDanger && (
                          <span className={styles.danger}>
                            <img
                              className={styles.px}
                              src="/icons/chapter-death.svg"
                              alt=""
                              width={16}
                              height={16}
                              style={{ marginTop: 3 }}
                            />
                            <span className={styles.dcol}>
                              <span className={styles.dlabel}>Danger</span>
                              {danger === null ? (
                                <NotKnown />
                              ) : danger === "none" ? (
                                <span>None</span>
                              ) : (
                                <span className={styles.dcol}>
                                  <span>
                                    {danger.foes}
                                    {danger.traps ? ", and traps" : ""}
                                  </span>
                                  {danger.boss ? (
                                    <span className={styles.boss}>
                                      {danger.boss}
                                    </span>
                                  ) : null}
                                </span>
                              )}
                            </span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {!anyDanger && (
                    <p className={styles.way}>
                      <span className={styles.muted}>
                        How dangerous these places are isn&apos;t known yet.
                      </span>
                    </p>
                  )}
                </Section>
              );
            })()}

          {page.choices.length > 0 && !ways && (
            <Section id="choices" icon="quest-ways" title="Choices that matter">
              {page.choices.map((c, i) => (
                <div key={i} className={styles.way}>
                  <span className={styles.who}>{c.choice}</span>
                  {c.leadsTo ? (
                    <p>
                      <Linked names={names} text={c.leadsTo} />
                    </p>
                  ) : null}
                </div>
              ))}
            </Section>
          )}
        </div>

        <aside className={styles.side}>
          <AutoToc />
          {(page.gets.xp > 0 || page.gets.rewards.length > 0) && (
            <Gold id="get">
              {page.gets.xp > 0 && (
                <span className={styles.rw}>
                  <span>
                    {page.gets.xp} XP
                    <button
                      type="button"
                      className={styles.info}
                      aria-label="About quest XP"
                      title={`LoreRim's XP for ${page.gets.type ? `a ${page.gets.type.toLowerCase()}` : "a quest"}, from Experience.ini`}
                    >
                      i
                    </button>
                  </span>
                  <small>When the quest is done</small>
                </span>
              )}
              {page.gets.rewards.map((r, i) => (
                <span key={i} className={styles.rw}>
                  <span>{r.what.charAt(0).toUpperCase() + r.what.slice(1)}</span>
                  {r.when ? (
                    <small>
                      {r.when.charAt(0).toUpperCase() + r.when.slice(1)}
                    </small>
                  ) : null}
                </span>
              ))}
            </Gold>
          )}

          {people.length > 0 && (
            <Panel id="ppl" icon="quest-people" title="People">
              <div className={styles.ppl}>
                {[...new Map(people.map((p) => [p.name, p])).values()].map(
                  (p) => {
                    const href = names.find((n) => n.text === p.name)?.href;
                    return (
                      <span key={p.name}>
                        {href ? (
                          <PreviewLink href={href}>{p.name}</PreviewLink>
                        ) : (
                          <b>{p.name}</b>
                        )}
                        {p.role ? <small>{p.role}</small> : null}
                      </span>
                    );
                  },
                )}
              </div>
            </Panel>
          )}
        </aside>
      </div>

      <div
        className={`${styles.foot} ${page.closes.length || page.opens.length ? "" : styles.alone}`}
      >
        {(page.closes.length > 0 || page.opens.length > 0) && (
          <Panel
            id="closes"
            icon="mark-lock"
            title={page.closes.length ? "What it closes" : "What it opens"}
          >
            {page.closes.length > 0 && (
              <ul className={styles.list}>
                {page.closes.map((c, i) => (
                  <li key={i}>
                    <Linked names={names} text={c} />
                  </li>
                ))}
              </ul>
            )}
            {page.opens.length > 0 && (
              <>
                {page.closes.length > 0 && (
                  <h3 className={styles.h3}>What it opens</h3>
                )}
                <ul className={styles.list}>
                  {page.opens.map((o, i) => (
                    <li key={i}>
                      {o.href ? (
                        <>
                          <PreviewLink href={o.href}>{o.name ?? o.text}</PreviewLink>
                          {o.name ? o.text.slice(o.name.length) : ""}
                          {o.mod?.modid ? (
                            <span className="muted">
                              {" "}
                              | from{" "}
                              <a
                                href={nexus(o.mod.modid)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {o.mod.name} ↗
                              </a>
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <Linked names={names} text={o.text} />
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        )}
      </div>

      <InformationConfidence
          id="sure"
          line={sureLine}
          sources={sources}
          unsure={page.unsure}
          actions={
            <>
              <ConfirmButton
                kind="quest"
                id={quest.edid}
                path={questHref(quest.edid) ?? "/quests"}
                title={name}
                signedIn={!!userId}
                mine={confirmed.mine}
                signIn={
                  <SignInButton
                    redirectTo={`${questHref(quest.edid)}`}
                    className="btn btn-primary"
                    label="Sign in to confirm"
                  />
                }
              />
              <QuestReport
                lineId={line.id}
                quests={[{ edid: quest.edid, name }]}
                signedIn={!!userId}
                open={reporting}
                label="Report a mistake"
                buttonClass="btn"
                signIn={<SignInButton redirectTo={`${questHref(quest.edid)}?report=1`} className="btn btn-sm btn-primary" label="Sign in with Discord" />}
              />
            </>
          }
        />
      </div>
    </main>
  );
}
