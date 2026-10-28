import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConfirmButton } from "@/components/pages/confirm-button";
import { SignInButton } from "@/components/site-header";
import { confirmationsOf } from "@/lib/quests/confirmations";
import { PreviewLink } from "@/components/pages/preview-link";
import { InformationConfidence, PageTop, Panel, Section, TitleBox } from "@/components/pages/page-kit";
import { notSureOf, personBySlug, roleWords, unsureFields } from "@/lib/people/data";
import { playersWords } from "@/lib/quests/reads";
import { GlanceBand, type GlanceCell } from "@/components/pages/glance";
import { AutoToc } from "@/components/pages/auto-toc";
import { Linked } from "@/components/pages/linked";
import { linkable } from "@/lib/pages/names";
import { questsData } from "@/lib/quests/data";
import { questHref } from "@/lib/quests/slugs";
import { dayHours, mainPlace } from "@/lib/people/day";
import l from "@/components/quests/line-page.module.css";
import { questsOf } from "@/lib/people/quests";
import { questCountSentence } from "@/lib/people/quest-count";
import { playerWords } from "@/lib/pages/player-words";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = personBySlug((await params).slug);
  if (!p) return {};
  return { title: p.name, ...siteMetadata(`/people/${p.slug}`, p.name, [p.race, p.inTown].filter(Boolean).join(" in ")) };
}

/** One colour for each place on the day strip. */
const STRIP = ["#74bfd2", "#f0913f", "#8fc07c", "#b7a2e6", "#e8c987", "#e07a6c"];
const cap = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
/** Where a read's "from" and "for" fall in a day, as a player says it. */
const whenWords = (from: string, span: string) => (/^any hour$/i.test(from) ? { head: "Any hour", small: "" } : { head: cap(from), small: span });

/**
 * A person's page (WO-154 Part 2), from the canvas board "Person page: Mjoll the Lioness". A person who has been read and checked
 * (WO-159: people_reads/checked) shows where to find them, what they offer and how each quest touches them, each field with "not sure"
 * where the checker could not settle it. A person not read yet says only what people.json holds (race, town, a Job* role) and the quests
 * that name them, and "Not known yet" for the rest.
 */
export default async function PersonPage({ params }: { params: Params }) {
  const person = personBySlug((await params).slug);
  if (!person) notFound();
  const userId = (await auth())?.user?.id ?? null;
  const confirmed = await confirmationsOf("person", person.slug, userId);
  const reporters = person.read?.reports ?? 0;
  const found = questsOf(person.name);
  const read = person.read ?? null;
  // What they sell and train: a read person says so by the read (a follower's vendor entry in the records is only trading with you).
  const sells = read ? !!read.sells : !!person.sells;
  const trainer = read ? (read.trains ? person.trainer : undefined) : person.trainer;
  const notSure = read ? unsureFields(read) : new Set<string>();
  // What the read is not sure of is said as a plain muted sentence, never as a bracket in the body; Not sure yet has the reason (WO-177 Part 5).
  const sure = (f: string) => (notSure.has(f) ? <em className={styles.nk}> Not sure yet.</em> : null);
  // The read's own hedges ("(presumably once you own Breezehome)") come out of its sentences and go to Not sure yet.
  const hedged: { field: string; why: string }[] = [];
  const changes = (read?.changes ?? []).map((c) => {
    const r = playerWords(c);
    for (const u of r.unsure) hedged.push({ field: "What changes where they are", why: u });
    return r.text;
  });
  // The quests the read lists with how each touches them, linked where the planner has the quest; those only the quest pages name follow.
  const byName = new Map(found.map((q) => [q.name.toLowerCase(), q]));
  // A quest the read names that the quest pages don't list this person in still has a page by its name.
  const pageOfName = new Map(questsData().lines.flatMap((x) => x.quests.map((q) => [q.name.toLowerCase(), questHref(q.edid)] as const)).filter(([, h]) => !!h));
  const givesIt = (how: string) => /^(gives it|can start it)\b/i.test(how);
  const quests: { name: string; href: string | null; gives: boolean; how: string }[] = read
    ? [
        ...read.quests.map((q) => {
          const hit = byName.get(q.quest.toLowerCase());
          return { name: q.quest, href: hit?.href ?? pageOfName.get(q.quest.toLowerCase()) ?? null, gives: !!hit?.gives || givesIt(q.how), how: cap(q.how) };
        }),
        ...found.filter((q) => !read.quests.some((r) => r.quest.toLowerCase() === q.name.toLowerCase())).map((q) => ({ name: q.name, href: q.href, gives: q.gives, how: q.gives ? "Gives it" : (q.role ?? "Has a part in it") })),
      ]
    : found.map((q) => ({ name: q.name, href: q.href, gives: q.gives, how: q.gives ? "Gives it" : (q.role ?? "Has a part in it") }));
  const gives = quests.filter((q) => q.gives);
  // One count, said the same way in the summary, At a glance and the list: "Gives 9 quests, and is in 3 more"; a person who gives none is "In 2 quests".
  const plural = (n: number) => `${n} quest${n === 1 ? "" : "s"}`;
  const alsoIn = quests.length - gives.length;
  const countWords = gives.length ? `Gives ${plural(gives.length)}${alsoIn ? `, and is in ${alsoIn} more` : ""}` : quests.length ? `In ${plural(quests.length)}` : "";
  // A merchant is "Sells goods" once, whether the records say so by a role or by a vendor list.
  const role = person.sells && /^Sells/.test(roleWords(person.role) ?? "") ? null : roleWords(person.role);
  const they = person.sex === "female" ? "her" : person.sex === "male" ? "him" : "them";
  const can = person.sex === "female" ? "She" : person.sex === "male" ? "He" : "They";
  // One person is he or she by the record's sex, never "they"; and only what is known: race, town, and the quests (WO-154 Part 4).
  const he = person.sex === "female" ? "She" : person.sex === "male" ? "He" : null;
  const what = person.race ? `A${/^[AEIOU]/i.test(person.race) ? "n" : ""} ${person.race}${person.inTown ? ` in ${person.inTown}` : ""}.` : person.inTown ? `Lives in ${person.inTown}.` : "";
  const gave = questCountSentence(he ?? person.name, gives.length, quests.length);
  const lede = [what, gave].filter(Boolean).join(" ");

  const subject = they === "her" ? "she" : they === "him" ? "he" : "they";
  type Offer = { title: string; body: React.ReactNode };
  const offers: Offer[] = [];
  if (read) {
    const killer = read.canDie.toLowerCase();
    if (person.follower || read.joins) {
      offers.push({
        title: "Follower",
        body: read.joins ? (
          <>
            {cap(read.joins)}
            {sure("joins")}
          </>
        ) : (
          <>
            {can} can join you. <em className={styles.nk}>How to recruit {they} isn&apos;t known yet.</em>
          </>
        ),
      });
    }
    // "yes (she is a potential spouse)": the yes is the row's, the bracket is the sentence.
    const wed = read.marries.replace(/^yes\b[\s:;,-]*/i, "").replace(/^\((.*)\)\.?$/, "$1").replace(/\.$/, "");
    if (person.marriage || /^yes/i.test(read.marries)) {
      offers.push({
        title: "Marriage",
        body: (
          <>
            {wed ? `${cap(wed)}.` : `You can marry ${they}.`}
            {sure("marries")}
          </>
        ),
      });
    }
    if (read.sells) {
      offers.push({
        title: "Sells",
        body: (
          <>
            {cap(read.sells)}
            {sure("sells")}
          </>
        ),
      });
    }
    if (read.trains) {
      offers.push({
        title: "Trains",
        body: (
          <>
            {cap(read.trains)}
            {sure("trains")}
          </>
        ),
      });
    }
    if (read.fightsWith) {
      offers.push({
        title: "Fights",
        body: (
          <>
            {cap(read.fightsWith)}
            {sure("fightsWith")}
          </>
        ),
      });
    }
    if (killer.startsWith("essential") || person.essential) {
      offers.push({
        title: "Can't be killed",
        body: killer === "essential" || !killer ? <>{can} is essential: {subject} goes down in a fight but gets back up.</> : <>{cap(read.canDie.replace(/ in (?:his|her|their) record/i, ""))}.</>,
      });
    } else if (killer.startsWith("protected")) {
      offers.push({ title: "Protected", body: killer === "protected" ? "Other characters can't kill " + they + ". You can." : cap(read.canDie) + "." });
    }
  } else {
    if (role)
      offers.push({
        title: role,
        body: (
          <>
            From the records. <em className={styles.nk}>What exactly isn&apos;t known yet.</em>
          </>
        ),
      });
    if (person.follower)
      offers.push({
        title: "Follower",
        body: (
          <>
            {can} can join you. <em className={styles.nk}>How to recruit {they} isn&apos;t known yet.</em>
          </>
        ),
      });
    if (person.marriage)
      offers.push({
        title: "Marriage",
        body: (
          <>
            You can marry {they}. <em className={styles.nk}>What {can.toLowerCase()} needs first isn&apos;t known yet.</em>
          </>
        ),
      });
    if (person.sells)
      offers.push({
        title: "Sells goods",
        body: <em className={styles.nk}>What {can.toLowerCase()} sells isn&apos;t known yet.</em>,
      });
    if (person.trainer) offers.push({ title: `Trains ${person.trainer.skill}`, body: person.trainer.cap ? `Up to ${person.trainer.cap}.` : "How far isn't known yet." });
    if (person.essential)
      offers.push({
        title: "Can't be killed",
        body: (
          <>
            {can} is essential: {can.toLowerCase()} goes down in a fight but gets back up.
          </>
        ),
      });
  }

  // The day as 24 hours, for the strip and for where they are most of it.
  const hours = read ? dayHours(read.day) : null;
  const mostly = hours ? mainPlace(hours) : null;
  const short = (t: string, n = 100) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
  // The person themself is not linked in their own words: skipped at the match, so one compiled pattern serves every page (a pattern for each person leaked memory, WO-177 Part 5).
  const L = (t: string) => <Linked text={t} names={linkable()} skip={`/people/${person.slug}`} />;
  const roleText = read?.role ? cap(read.role.split(";")[0].trim()) : (role ?? person.race ?? null);
  const sellsText = read?.sells ? cap(read.sells.split(/[;(]|,\s*\d/)[0].trim().replace(/\.$/, "")) : sells ? "Goods" : null;
  // At a glance (WO-165, rule 34): where to find them (teal), what they are (orange), what they sell (gold) or train (green), that they follow you (orange), and their quests (violet).
  const cells: GlanceCell[] = [
    {
      key: "where",
      icon: "quest-travel",
      tone: "teal" as const,
      label: `Where to find ${they}`,
      value: L(mostly?.main ?? person.inTown ?? person.cell ?? "Not known yet"),
      sub: L(read?.firstMeet ? `First met: ${short(read.firstMeet.replace(/\.$/, ""), 90)}` : mostly && mostly.places.length > 1 ? `Also ${mostly.places.slice(1, 3).join(", ")}` : `Where ${subject} ${subject === "they" ? "are" : "is"} through the day isn't known yet`),
      small: true,
    },
    ...(roleText ? [{ key: "role", icon: "quest-people", tone: "orange" as const, label: `What ${subject} ${subject === "they" ? "are" : "is"}`, value: L(roleText ?? ""), small: roleText.length > 22 }] : []),
    ...(trainer ? [{ key: "trains", icon: "tab-levels", tone: "green" as const, label: "Trains", value: trainer.skill, sub: trainer.cap ? `Up to ${trainer.cap}` : undefined }] : sellsText ? [{ key: "sells", icon: "quest-rewards", tone: "gold" as const, label: "Sells", value: sellsText, sub: read?.sells ? short(read.sells.replace(/^[^,;(]*[,;(]\s*/, ""), 70) || undefined : undefined, small: sellsText.length > 20 }] : []),
    ...(person.follower ? [{ key: "follows", icon: "quest-followers", tone: "orange" as const, label: "Follows you", value: "Yes", sub: notSure.has("joins") ? "How isn't sure yet" : L(read?.joins ? short(read.joins, 110) : "How to recruit isn't known yet") }] : []),
    ...(quests.length ? [{ key: "quests", icon: "quest-side-stories", tone: "violet" as const, label: "Quests", value: gives.length ? `Gives ${plural(gives.length)}` : `In ${plural(quests.length)}`, sub: [alsoIn && gives.length ? `and is in ${alsoIn} more` : "", (gives.length ? gives : quests).slice(0, 2).map((q) => q.name).join("; ")].filter(Boolean).join(". ") }] : []),
  ].slice(0, 5);
  // On a phone the sections are the first screen: the cells that repeat one (where, what they sell or train, whether they follow, their quests) are left out, and the role stays.
  if (cells.some((c) => c.key === "role")) for (const c of cells) if (c.key !== "role") c.hidePhone = true;

  return (
    <main className={l.root}>
      <div className={`page ${l.top}`}>
      <PageTop back={{ href: "/people", label: "People" }} />

      <TitleBox
        title={person.name}
        tags={
          <>
            {person.race && <span className={styles.tag}>{person.race}</span>}
            {person.inTown && <span className={styles.tag}>{person.inTown}</span>}
            {role && <span className={styles.role}>{role}</span>}
            {person.follower && !notSure.has("joins") && <span className={styles.role}>Follower</span>}
            {/* A tag says only what the page is sure of (WO-177): a marriage the read is not sure of is in Not sure yet, not in a tag. */}
            {person.marriage && !notSure.has("marries") && <span className={styles.role}>Can marry</span>}
            {gives.length > 0 && <span className={styles.role}>Gives quests</span>}
            {sells && <span className={styles.role}>Sells goods</span>}
            {trainer && <span className={styles.role}>Trains {trainer.skill}</span>}
            {person.essential && <span className={styles.tag}>Can&apos;t be killed</span>}
          </>
        }
      />

      {lede && <p className={styles.lede}>{lede}</p>}
      </div>

      <GlanceBand cells={cells} />

      <div className={`page ${styles.main}`} style={{ paddingTop: 44 }}>
      <div className={styles.cols}>
        <div className={styles.body}>
          {read && (read.firstMeet || read.day.length > 0) && (
            <Section id="where" icon="quest-travel" title={`Where to find ${they}`}>
              {read.firstMeet && (
                <p className={styles.firstMeet}>
                  <b>First meeting.</b> {L(cap(read.firstMeet))}
                  {sure("firstMeet")}
                </p>
              )}
              {hours && read.day.length > 1 && (
                <div className={styles.strip} role="img" aria-label={`Through the day: ${[...new Set(hours.filter(Boolean))].join(", ")}`}>
                  <div className={styles.stripBar}>
                    {hours.map((h, i) => (
                      <i key={i} title={`${i === 0 ? "12 am" : i < 12 ? `${i} am` : i === 12 ? "noon" : `${i - 12} pm`}: ${h ?? "not said"}`} style={{ background: h ? STRIP[[...new Set(hours.filter(Boolean))].indexOf(h) % STRIP.length] : "transparent" }} />
                    ))}
                  </div>
                  <div className={styles.stripTicks} aria-hidden="true">
                    <span>12 am</span>
                    <span>6 am</span>
                    <span>noon</span>
                    <span>6 pm</span>
                  </div>
                  <div className={styles.stripKey}>
                    {[...new Set(hours.filter(Boolean))].map((h, i) => (
                      <span key={h}>
                        <i style={{ background: STRIP[i % STRIP.length] }} />
                        {L(h ?? "")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {read.day.length > 0 && (
                <div className={styles.dayList} role="list" aria-label="Through the day">
                  {read.day.map((d, i) => {
                    const w = whenWords(d.from, d.for);
                    return (
                      <div key={i} role="listitem" className={styles.dayRow}>
                        <span className={styles.when}>
                          <b>{w.head}</b>
                          {w.small && <small>{w.small}</small>}
                        </span>
                        <span className={styles.where}>
                          <b>{L(cap(d.where))}</b>
                          {d.doing && <span>{L(cap(d.doing))}</span>}
                        </span>
                      </div>
                    );
                  })}
                  {sure("day") && <p className={styles.dayNote}>Where {subject} {subject === "they" ? "are" : "is"} through the day: not sure.</p>}
                </div>
              )}
              {changes.length > 0 && (
                <div className={styles.changes}>
                  <h3 className={styles.h3}>What changes it</h3>
                  <ul>
                    {changes.map((c) => (
                      <li key={c}>{L(c)}</li>
                    ))}
                  </ul>
                  {sure("changes") && <p className={styles.dayNote}>What changes it: not sure yet.</p>}
                </div>
              )}
            </Section>
          )}
          {quests.length > 0 && (
            <Section id="quests" icon="tab-play" title={person.sex === "female" ? "Her quests" : person.sex === "male" ? "His quests" : "Their quests"} count={countWords}>
              {quests.map((q) => (
                <div key={q.name} className={`${styles.qrow} ${read ? styles.qrowRead : ""}`}>
                  {q.href ? <PreviewLink href={q.href}>{q.name}</PreviewLink> : <b className={styles.qname}>{q.name}</b>}
                  <span className={styles.qdesc}>{L(q.how)}</span>
                </div>
              ))}
              {sure("quests") && <p className={styles.dayNote}>Which quests {they === "them" ? "they are" : they === "her" ? "she is" : "he is"} in: not sure.</p>}
            </Section>
          )}
        </div>

        <aside className={styles.side}>
          <AutoToc />
          {offers.length > 0 && (
            <>
              <Panel id="offers" icon="quest-people" title={they === "them" ? "What they offer" : `What ${they === "her" ? "she" : "he"} offers`}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {offers.map((o) => (
                    <span key={o.title} className={styles.offer}>
                      <b>{o.title}</b>
                      <span>{o.body}</span>
                    </span>
                  ))}
                </div>
              </Panel>
            </>
          )}
        </aside>
      </div>

      <InformationConfidence
        id="sure"
        line={read ? "Read from the game files and checked by a second reader." : "From the game files. A second reader hasn't checked this page yet."}
        sources={[
          read
            ? { mark: "yes", name: "LoreRim's game files", note: "Read, then checked by a second reader" }
            : { mark: "yes", name: "LoreRim's game files", note: "Their race, where they are placed and their quests, from the records" },
          read ? { mark: "yes", name: "Second reader", note: "Checked every answer against the records" } : { mark: "no", name: "Second reader", note: "Not yet" },
          reporters || confirmed.names.length
            ? {
                mark: "yes",
                name: "Players",
                note: [reporters ? playersWords(reporters) : "", confirmed.names.length ? `Confirmed by ${confirmed.names.length} ${confirmed.names.length === 1 ? "player" : "players"}` : ""].filter(Boolean).join(". "),
                names: confirmed.names.map((n) => <span key={n}>{n}</span>),
              }
            : { mark: "no", name: "Players", note: "No reports. No one has confirmed this page yet." },
        ]}
        unsure={read ? [...notSureOf(read), ...hedged] : [{ field: "where they are through the day and night" }, { field: "what changes where they are" }, ...(person.follower || person.marriage ? [{ field: "how to recruit or marry them" }] : [])]}
        actions={
          <>
            <ConfirmButton kind="person" id={person.slug} path={`/people/${person.slug}`} title={person.name} signedIn={!!userId} mine={confirmed.mine} signIn={<SignInButton redirectTo={`/people/${person.slug}`} className="btn btn-primary" label="Sign in to confirm" />} />
            <Link href="/quests" className="btn">
              Report a mistake
            </Link>
          </>
        }
      />
      </div>
    </main>
  );
}
