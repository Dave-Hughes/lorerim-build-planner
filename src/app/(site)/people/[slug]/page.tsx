import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConfirmButton } from "@/components/pages/confirm-button";
import { SignInButton } from "@/components/site-header";
import { confirmationsOf } from "@/lib/quests/confirmations";
import { HowSure, PageTop, Panel, Section, TitleBox } from "@/components/pages/page-kit";
import { personBySlug, roleWords } from "@/lib/people/data";
import { questsOf } from "@/lib/people/quests";
import { siteMetadata } from "@/lib/og/metadata";
import styles from "@/components/pages/page-kit.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = personBySlug((await params).slug);
  if (!p) return {};
  return { title: p.name, ...siteMetadata(`/people/${p.slug}`, p.name, [p.race, p.inTown].filter(Boolean).join(" in ")) };
}

/**
 * A person's page (WO-154 Part 2), from the canvas board "Person page: Mjoll the Lioness". Until the people reads land (WO-155) it says
 * only what people.json holds (race, town, the cell they are placed in, a Job* role) and the quests that name them; the day strip and
 * what they offer say "Not known yet" rather than read the AI packages by rule.
 */
export default async function PersonPage({ params }: { params: Params }) {
  const person = personBySlug((await params).slug);
  if (!person) notFound();
  const userId = (await auth())?.user?.id ?? null;
  const confirmed = await confirmationsOf("person", person.slug, userId);
  const quests = questsOf(person.name);
  const gives = quests.filter((q) => q.gives);
  const role = roleWords(person.role);
  const placed = [person.cell, person.inTown].filter(Boolean).join(", ");
  const lede = [
    `${person.race ? `A${/^[AEIOU]/i.test(person.race) ? "n" : ""} ${person.race}` : "Someone"}${person.inTown ? ` in ${person.inTown}` : ""}${person.cell ? ` placed in ${person.cell}` : ""}.`,
    gives.length ? `They give ${gives.length === 1 ? "a quest" : `${gives.length} quests`}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={`page ${styles.main}`}>
      <PageTop back={{ href: person.inTown ? `/quests?q=${encodeURIComponent(person.inTown)}` : "/quests", label: person.inTown ?? "Quests" }} />

      <TitleBox
        title={person.name}
        tags={
          <>
            {person.race && <span className={styles.tag}>{person.race}</span>}
            {person.inTown && <span className={styles.tag}>{person.inTown}</span>}
            {role && <span className={styles.role}>{role}</span>}
            {gives.length > 0 && <span className={styles.role}>Gives quests</span>}
          </>
        }
      />

      <p className={styles.lede}>{lede}</p>

      <div className={styles.cols}>
        <div className={styles.body}>
          <Section id="where" icon="quest-travel" title={person.sex === "female" ? "Where to find her" : person.sex === "male" ? "Where to find him" : "Where to find them"}>
            <div className={styles.day} role="img" aria-label="The day, midnight to midnight: where they are isn't known yet">
              <span className={styles.seg} style={{ gridColumn: "span 24" }}>
                Not known yet
              </span>
            </div>
            <div className={styles.ticks}>
              <span>Midnight</span>
              <span>6 am</span>
              <span>Noon</span>
              <span>6 pm</span>
              <span>Midnight</span>
            </div>
            <div style={{ paddingTop: 10 }}>
              {placed ? (
                <div className={styles.slot}>
                  <span>The game places them in {placed}</span>
                  <small>Where they go through the day and night isn&apos;t known yet</small>
                </div>
              ) : (
                <div className={styles.slot}>
                  <span className={styles.muted}>Not known yet</span>
                </div>
              )}
              {person.cells.length > 1 && (
                <div className={styles.slot}>
                  <span>Also placed in {person.cells.slice(1).join(", ")}</span>
                </div>
              )}
            </div>
          </Section>

          {quests.length > 0 && (
            <Section id="quests" icon="tab-play" title={person.sex === "female" ? "Her quests" : person.sex === "male" ? "His quests" : "Their quests"}>
              {quests.map((q) => (
                <div key={q.href} className={styles.qrow}>
                  <Link href={q.href}>{q.name}</Link>
                  <span>{q.gives ? "Gives it" : (q.role ?? "Has a part in it")}</span>
                </div>
              ))}
            </Section>
          )}
        </div>

        {(role || gives.length > 0) && (
          <aside className={styles.side}>
            <Panel id="offers" icon="quest-people" title="What they offer">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {role && (
                  <span className={styles.offer}>
                    <b>{role}</b>
                    <span>
                      From the records. <em className={styles.nk}>What exactly isn&apos;t known yet.</em>
                    </span>
                  </span>
                )}
                {gives.length > 0 && (
                  <span className={styles.offer}>
                    <b>Quests</b>
                    <span>{gives.map((q) => q.name).join(", ")}</span>
                  </span>
                )}
              </div>
            </Panel>
          </aside>
        )}
      </div>

      <HowSure
        id="sure"
        line="Read from the game files. Not read by a reader yet."
        sources={[
          { mark: "yes", name: "LoreRim's game files", note: "Their race, where they are placed and their quests, from the records" },
          { mark: "no", name: "Second reader", note: "Not yet" },
          confirmed.names.length
            ? { mark: "yes", name: "Players", note: `${confirmed.names.length} confirmed this page`, names: confirmed.names.map((n) => <span key={n}>{n}</span>) }
            : { mark: "no", name: "Players", note: "No reports. No one has confirmed this page yet." },
        ]}
        unsure={[{ field: "where they are through the day and night" }, { field: "whether they follow you, marry or sell and train" }, { field: "what changes where they are" }]}
        actions={
          <>
            <ConfirmButton kind="person" id={person.slug} path={`/people/${person.slug}`} title={person.name} signedIn={!!userId} mine={confirmed.mine} signIn={<SignInButton redirectTo={`/people/${person.slug}`} className="btn btn-primary" label="Sign in to confirm" />} />
            <Link href="/quests" className="btn">
              Report a mistake
            </Link>
          </>
        }
      />
    </main>
  );
}
