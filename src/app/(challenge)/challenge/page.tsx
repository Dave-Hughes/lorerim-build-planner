import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChallengeHero } from "@/components/challenge/challenge-hero";
import { challengeOn } from "@/lib/features";
import { CHALLENGE_AUTHOR, CHALLENGE_THREAD_URL, MOD_DOWNLOAD_URL, MOD_SOURCE_URL } from "@/lib/challenge/links";
import styles from "@/components/challenge/challenge.module.css";

const LINE = "Craft everything you use. A LoreRim mod that keeps the rules of the challenge for you.";

export const metadata: Metadata = { title: "Zenithar's Challenge", description: LINE };

/** The rules as the mod keeps them, one line each, in the order a player meets them. */
const RULES = [
  "Every weapon, piece of armor, shield and arrow you use is one you crafted.",
  "All your ore comes from veins you mined, and all your firewood from blocks you chopped.",
  "All your leather and meat comes from animals you hunted.",
  "All the food you eat is food you cooked, and every potion is one you brewed.",
  "You sell only what is your own.",
  "No magic outside enchanting: no spells, scrolls or staves.",
  "No missives.",
  "Survival Mode stays on.",
];

const MADE = ["Septims", "Alchemy ingredients", "Raw fruit and vegetables", "Glass", "Linen wraps", "Provisions", "A pickaxe and a woodcutter's axe, however you get them"];

/** The challenge's front page: the forge, what the challenge is, what the mod does, and how to get it. */
export default function Challenge() {
  if (!challengeOn()) notFound();
  return (
    <>
      <ChallengeHero title="Zenithar's Challenge" line={LINE}>
        {MOD_DOWNLOAD_URL ? (
          <a href={MOD_DOWNLOAD_URL} className="btn btn-primary btn-lg">
            Download
          </a>
        ) : null}
        <Link href="/challenge/leaderboard" className="btn btn-lg">
          Leaderboard
        </Link>
      </ChallengeHero>
      <main className={`page ${styles.main}`}>
        <section className={styles.section}>
          <h2 className={styles.h2}>The challenge</h2>
          <p>
            Zenithar&apos;s Challenge is a way to play LoreRim{CHALLENGE_AUTHOR ? `, written by ${CHALLENGE_AUTHOR} on the LoreRim Discord` : ", written on the LoreRim Discord"}. You make everything you
            use, from ore you mined, wood you chopped and animals you hunted. Looting, buying and selling are cut down to a short list.
          </p>
          {CHALLENGE_THREAD_URL ? (
            <p>
              <a href={CHALLENGE_THREAD_URL} target="_blank" rel="noopener noreferrer">
                Read the rules on Discord
              </a>
            </p>
          ) : null}
          <ol>
            {RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <h3 className={styles.h3}>Yours from any source</h3>
          <ul>
            {MADE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>The mod</h2>
          <p>
            The mod counts what you craft, cook, brew, mine, chop and hunt, and follows those items into chests and back. When your character is made you choose how the rules are kept. The
            choice is made once and holds for the run.
          </p>
          <div className={styles.two}>
            <div className={styles.panel}>
              <h3 className={styles.h3}>Oath</h3>
              <p>The game holds you to the rules. Gear, food and potions you did not make cannot be used, spells come back off, and a sale of something that is not yours is undone.</p>
            </div>
            <div className={styles.panel}>
              <h3 className={styles.h3}>Honor</h3>
              <p>You hold yourself to the rules. Nothing is stopped. Each broken rule shows a warning and goes on your run&apos;s record.</p>
            </div>
          </div>
          <p>The rules the challenge leaves up to you are chosen at the same time: looted gems, looted soul gems, gems from coin purses, quest rewards, starting items, and animals you did not kill yourself.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Install</h2>
          {MOD_DOWNLOAD_URL ? (
            <ol>
              <li>
                <a href={MOD_DOWNLOAD_URL}>Download the mod</a>.
              </li>
              <li>In Mod Organizer 2, install it from the archive and tick it in the left pane. It can sit anywhere in the list.</li>
              <li>Start a new character. When LoreRim&apos;s own setup is over, the mod asks for Oath or Honor.</li>
            </ol>
          ) : (
            <p>The mod is in testing. The download will be here when it is released.</p>
          )}
          <p>
            It is one SKSE plugin with no ESP, made for LoreRim 5.0.4.8. LoreRim already has what it needs. LoreRim&apos;s rule applies: adding any mod to the list voids support from the LoreRim
            team. <a href={MOD_SOURCE_URL}>The source is on GitHub</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Your run</h2>
          <p>Each time the game saves, the mod writes one small file for your character. It holds what you made, every broken rule, your kills and the rules you chose. Nothing is sent anywhere.</p>
          <p className={styles.path}>Documents\My Games\Skyrim Special Edition\SKSE\ZenitharsChallenge\</p>
          <p>
            Upload that file on the <Link href="/challenge/leaderboard">leaderboard</Link> to put your run there. The file is sealed, so one changed by hand is refused.
          </p>
        </section>
      </main>
    </>
  );
}
