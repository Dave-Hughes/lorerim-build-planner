import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChallengeHero } from "@/components/challenge/challenge-hero";
import { challengeOn } from "@/lib/features";
import { boardRows, type BoardRow } from "@/lib/challenge/store";
import { CHALLENGE_AUTHOR, CHALLENGE_THREAD_URL, MOD_DOWNLOAD_URL, MOD_SOURCE_URL } from "@/lib/challenge/links";
import styles from "@/components/challenge/challenge.module.css";

const LINE = "Craft everything you use.";

export const metadata: Metadata = { title: "Zenithar's Challenge", description: "Craft everything you use. A LoreRim mod that keeps the rules of the challenge for you." };
export const dynamic = "force-dynamic";

/* eslint-disable @next/next/no-img-element */
const Pixel = ({ name, size }: { name: string; size: number }) => <img className={styles.pixel} src={`/icons/${name}.svg`} alt="" width={size} height={size} />;

/** The rules, each as a picture and a few words. */
const RULES: { icon: string; words: string; no?: boolean }[] = [
  { icon: "smithing", words: "Forge your own gear" },
  { icon: "weapon-pickaxe", words: "Mine your own ore" },
  { icon: "challenge-chop", words: "Chop your own wood" },
  { icon: "challenge-hunt", words: "Hunt your own hides and meat" },
  { icon: "challenge-cook", words: "Cook your own food" },
  { icon: "alchemy", words: "Brew your own potions" },
  { icon: "deity-zenithar", words: "Sell only your own work" },
  { icon: "need-cold", words: "Survival Mode on" },
  { icon: "challenge-no-magic", words: "No spells, scrolls or staves", no: true },
  { icon: "challenge-no-missive", words: "No missives", no: true },
];

const days = (n: number) => n.toFixed(n < 10 ? 1 : 0);

/** The rules the challenge leaves to the player, chosen when the character is made. */
const YOURS: { icon: string; words: string }[] = [
  { icon: "challenge-gem", words: "Looted gems" },
  { icon: "challenge-soul-gem", words: "Looted soul gems" },
  { icon: "quest-rewards", words: "Coin purse gems" },
  { icon: "challenge-reward", words: "Quest rewards" },
  { icon: "slot-backpack", words: "Starting gear" },
  { icon: "challenge-kills", words: "Others' kills" },
];

function Top({ rows }: { rows: BoardRow[] }) {
  if (rows.length === 0) return <p className={styles.empty}>No runs yet. The first place is open.</p>;
  return (
    <ol className={styles.topList}>
      {rows.map((row, i) => (
        <li key={row.id}>
          <span className={styles.place}>{i + 1}</span>
          <Link href={`/challenge/run/${row.id}`}>{row.characterName}</Link>
          <span className={styles.topDays}>{days(row.days)} days</span>
          <span className={row.rulesBroken === 0 ? styles.clean : styles.broke}>{row.rulesBroken === 0 ? "Clean" : `${row.rulesBroken} broken`}</span>
        </li>
      ))}
    </ol>
  );
}

/** The challenge's front page: the smithy, the rules as pictures, the rules left to the player, how to start, and the top runs. */
export default async function Challenge() {
  if (!challengeOn()) notFound();
  // A table that isn't there yet (a preview that hasn't run the migration) reads as an empty board, not an error.
  const top = await boardRows(5).catch(() => []);
  return (
    <>
      <ChallengeHero over="LoreRim's" title="Zenithar's Challenge" line={LINE}>
        {MOD_DOWNLOAD_URL ? (
          <a href={MOD_DOWNLOAD_URL} className="btn btn-primary btn-lg">
            Download
          </a>
        ) : null}
        <Link href="/challenge/leaderboard" className="btn btn-lg">
          Leaderboard
        </Link>
      </ChallengeHero>
      <main className={`page ${styles.front}`}>
        <section className={styles.block}>
          <h2 className={styles.title}>The rules</h2>
          <ul className={styles.rules}>
            {RULES.map((rule) => (
              <li key={rule.words} className={rule.no ? styles.no : undefined}>
                <Pixel name={rule.icon} size={80} />
                <span>{rule.words}</span>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Septims, ingredients, raw fruit and vegetables, glass, linen wraps and provisions are yours wherever you find them.
            {CHALLENGE_THREAD_URL ? (
              <>
                {" "}
                <a href={CHALLENGE_THREAD_URL} target="_blank" rel="noopener noreferrer">
                  {CHALLENGE_AUTHOR ? `${CHALLENGE_AUTHOR}'s rules on Discord` : "The full rules on Discord"}
                </a>
              </>
            ) : null}
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.title}>Six are up to you</h2>
          <ul className={`${styles.rules} ${styles.six}`}>
            {YOURS.map((rule) => (
              <li key={rule.words}>
                <Pixel name={rule.icon} size={64} />
                <span>{rule.words}</span>
              </li>
            ))}
          </ul>
          <p className={styles.note}>Allow each or not when your character is made. The mod holds you to the rest: what you did not make cannot be used or sold.</p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.title}>Start a run</h2>
          <ol className={styles.steps}>
            <li>
              <Pixel name="quest-chest" size={64} />
              <h3 className={styles.stepName}>Get the mod</h3>
              <p>
                {MOD_DOWNLOAD_URL ? <a href={MOD_DOWNLOAD_URL}>Download it</a> : "In testing now. The download will be here."} Install it in Mod Organizer 2 and tick it. LoreRim 5.0.4.8.
              </p>
            </li>
            <li>
              <Pixel name="challenge-oath" size={64} />
              <h3 className={styles.stepName}>Make a character</h3>
              <p>After LoreRim&apos;s own setup, take the challenge and pick the rules that are up to you.</p>
            </li>
            <li>
              <Pixel name="challenge-trophy" size={64} />
              <h3 className={styles.stepName}>Upload your run</h3>
              <p>
                Every save writes your run to a file. Put it on the <Link href="/challenge/leaderboard">leaderboard</Link>.
              </p>
            </li>
          </ol>
          <p className={styles.note}>
            One SKSE plugin, no ESP. Adding any mod to LoreRim voids support from the LoreRim team. <a href={MOD_SOURCE_URL}>Source on GitHub</a>
          </p>
        </section>

        <section className={styles.block}>
          <h2 className={styles.title}>Top runs</h2>
          <div className={styles.top}>
            <Top rows={top} />
          </div>
          <p>
            <Link href="/challenge/leaderboard" className="btn">
              Whole leaderboard
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
