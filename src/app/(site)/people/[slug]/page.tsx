import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConfirmButton } from "@/components/pages/confirm-button";
import { SignInButton } from "@/components/site-header";
import { confirmationsOf } from "@/lib/quests/confirmations";
import { PreviewLink } from "@/components/pages/preview-link";
import { InformationConfidence, PageTop, Panel, Section, TitleBox } from "@/components/pages/page-kit";
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
  // A merchant is "Sells goods" once, whether the records say so by a role or by a vendor list.
  const role = person.sells && /^Sells/.test(roleWords(person.role) ?? "") ? null : roleWords(person.role);
  const they = person.sex === "female" ? "her" : person.sex === "male" ? "him" : "them";
  const can = person.sex === "female" ? "She" : person.sex === "male" ? "He" : "They";
  // One person is he or she by the record's sex, never "they"; and only what is known: race, town, and the quests (WO-154 Part 4).
  const he = person.sex === "female" ? "She" : person.sex === "male" ? "He" : null;
  const count = (n: number) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? String(n);
  const what = person.race ? `A${/^[AEIOU]/i.test(person.race) ? "n" : ""} ${person.race}${person.inTown ? ` in ${person.inTown}` : ""}.` : person.inTown ? `Lives in ${person.inTown}.` : "";
  const gave = gives.length ? `${he ?? person.name} gives ${count(gives.length)} quest${gives.length === 1 ? "" : "s"}.` : "";
  const lede = [what, gave].filter(Boolean).join(" ");

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
            {person.follower && <span className={styles.role}>Follower</span>}
            {person.marriage && <span className={styles.role}>Can marry</span>}
            {gives.length > 0 && <span className={styles.role}>Gives quests</span>}
            {person.sells && <span className={styles.role}>Sells goods</span>}
            {person.trainer && <span className={styles.role}>Trains {person.trainer.skill}</span>}
            {person.essential && <span className={styles.tag}>Can&apos;t be killed</span>}
          </>
        }
      />

      {lede && <p className={styles.lede}>{lede}</p>}

      <div className={styles.cols}>
        <div className={styles.body}>
          {quests.length > 0 && (
            <Section id="quests" icon="tab-play" title={person.sex === "female" ? "Her quests" : person.sex === "male" ? "His quests" : "Their quests"}>
              {quests.map((q) => (
                <div key={q.href} className={styles.qrow}>
                  <PreviewLink href={q.href}>{q.name}</PreviewLink>
                  <span>{q.gives ? "Gives it" : (q.role ?? "Has a part in it")}</span>
                </div>
              ))}
            </Section>
          )}
        </div>

        {(role || person.follower || person.marriage || person.sells || person.trainer || person.essential || gives.length > 0) && (
          <aside className={styles.side}>
            <Panel id="offers" icon="quest-people" title={they === "them" ? "What they offer" : `What ${they === "her" ? "she" : "he"} offers`}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {role && (
                  <span className={styles.offer}>
                    <b>{role}</b>
                    <span>
                      From the records. <em className={styles.nk}>What exactly isn&apos;t known yet.</em>
                    </span>
                  </span>
                )}
                {person.follower && (
                  <span className={styles.offer}>
                    <b>Follower</b>
                    <span>
                      {can} can join you. <em className={styles.nk}>How to recruit {they} isn&apos;t known yet.</em>
                    </span>
                  </span>
                )}
                {person.marriage && (
                  <span className={styles.offer}>
                    <b>Marriage</b>
                    <span>
                      You can marry {they}. <em className={styles.nk}>What {can.toLowerCase()} needs first isn&apos;t known yet.</em>
                    </span>
                  </span>
                )}
                {person.sells && (
                  <span className={styles.offer}>
                    <b>Sells goods</b>
                    <span>
                      <em className={styles.nk}>What {can.toLowerCase()} sells isn&apos;t known yet.</em>
                    </span>
                  </span>
                )}
                {person.trainer && (
                  <span className={styles.offer}>
                    <b>Trains {person.trainer.skill}</b>
                    <span>{person.trainer.cap ? `Up to ${person.trainer.cap}.` : "How far isn't known yet."}</span>
                  </span>
                )}
                {person.essential && (
                  <span className={styles.offer}>
                    <b>Can&apos;t be killed</b>
                    <span>{can} is essential: {can.toLowerCase()} goes down in a fight but gets back up.</span>
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

      <InformationConfidence
        id="sure"
        line="Read from the game files. Not read by a reader yet."
        sources={[
          { mark: "yes", name: "LoreRim's game files", note: "Their race, where they are placed and their quests, from the records" },
          { mark: "no", name: "Second reader", note: "Not yet" },
          confirmed.names.length
            ? { mark: "yes", name: "Players", note: `Confirmed by ${confirmed.names.length} ${confirmed.names.length === 1 ? "player" : "players"}`, names: confirmed.names.map((n) => <span key={n}>{n}</span>) }
            : { mark: "no", name: "Players", note: "No reports. No one has confirmed this page yet." },
        ]}
        unsure={[{ field: "where they are through the day and night" }, { field: "what changes where they are" }, ...(person.follower || person.marriage ? [{ field: "how to recruit or marry them" }] : [])]}
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
