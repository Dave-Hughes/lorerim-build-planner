import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { challengeOn } from "@/lib/features";
import { deleteRun } from "@/lib/challenge/actions";
import { savedRun } from "@/lib/challenge/store";
import type { Run, RunOptions } from "@/lib/challenge/run-file";
import { isValidBuildId } from "@/lib/builds/ids";
import { formatDate } from "@/lib/format/date";
import styles from "@/components/challenge/challenge.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

const WAYS = [
  ["crafted", "Crafted"],
  ["cooked", "Cooked"],
  ["brewed", "Brewed"],
  ["mined", "Mined"],
  ["chopped", "Chopped"],
  ["hunted", "Hunted"],
] as const;

const OPTIONS: [keyof RunOptions, string][] = [
  ["lootGems", "Looted gems"],
  ["lootSoulGems", "Looted soul gems"],
  ["coinPurseGems", "Coin purse gems"],
  ["questRewards", "Quest rewards"],
  ["startingItems", "Starting items"],
  ["othersKills", "Others' kills"],
];

const RULE_WORDS: Record<Run["rulesBroken"][number]["rule"], string> = {
  gear: "Used gear not made by the player",
  food: "Ate food not cooked by the player",
  potion: "Used a potion not brewed by the player",
  sale: "Sold something not the player's own",
  magic: "Used magic",
  missive: "Took a missive",
  material: "Crafted with materials not gathered by the player",
  other: "Broke a rule",
};

const load = async (id: string) => (isValidBuildId(id) ? await savedRun(id).catch(() => null) : null);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const run = challengeOn() ? await load((await params).id) : null;
  return { title: run ? `${run.characterName} | Zenithar's Challenge` : "Zenithar's Challenge" };
}

/** How many of one item were made, whichever way. */
const itemCount = (item: Run["made"]["items"][number]) => WAYS.reduce((n, [key]) => n + (typeof item[key] === "number" ? (item[key] as number) : 0), 0);

/** One player's run: who, how the rules were kept, what was made, every broken rule in order, and the kills. */
export default async function RunPage({ params }: { params: Params }) {
  if (!challengeOn()) notFound();
  const saved = await load((await params).id);
  if (!saved) notFound();
  const { run } = saved;
  const mine = (await auth().catch(() => null))?.user?.id === saved.userId;
  const items = [...run.made.items].sort((a, b) => itemCount(b) - itemCount(a) || a.name.localeCompare(b.name));
  const kills = [...run.kills].sort((a, b) => b.count - a.count || a.kind.localeCompare(b.kind));

  return (
    <main className={`page ${styles.main}`}>
      <header className={styles.runHead}>
        <h1 className={styles.runTitle}>{saved.characterName}</h1>
        <p className={styles.byline}>
          <span className={styles.tag}>{saved.mode === "oath" ? "Oath" : "Honor"}</span>
          <span>
            {saved.race}, level {saved.level}
          </span>
          <span>Played by {saved.player}</span>
        </p>
      </header>

      <section className={styles.section}>
        <dl className={styles.facts}>
          <dt>In-game days</dt>
          <dd>{saved.days.toFixed(1)}</dd>
          <dt>Items made</dt>
          <dd>{saved.itemsMade.toLocaleString("en-US")}</dd>
          <dt>Rules broken</dt>
          <dd className={saved.rulesBroken === 0 ? styles.clean : styles.broke}>{saved.rulesBroken}</dd>
          <dt>Kills</dt>
          <dd>{saved.kills.toLocaleString("en-US")}</dd>
          <dt>Console opened</dt>
          <dd>{saved.consoleOpened === 0 ? "Never" : `${saved.consoleOpened.toLocaleString("en-US")} times`}</dd>
          <dt>Plugins loaded</dt>
          <dd>{run.plugins.count.toLocaleString("en-US")}</dd>
          <dt>Written by the mod</dt>
          <dd>{formatDate(saved.writtenAt)}</dd>
        </dl>
      </section>

      {run.options ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>Rules chosen</h2>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <tbody>
                {OPTIONS.map(([key, label]) => (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>{run.options?.[key] ? "Count as the player's own" : "Do not count"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.h2}>Made</h2>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {WAYS.map(([key, label]) => (
                  <th key={key} className={styles.n}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {WAYS.map(([key]) => (
                  <td key={key} className={styles.n}>
                    {run.made[key].toLocaleString("en-US")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {items.length ? (
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className={styles.n}>Made</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 200).map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className={styles.n}>{itemCount(item).toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Rules broken</h2>
        {run.rulesBroken.length === 0 ? (
          <p>None.</p>
        ) : (
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.n}>Day</th>
                  <th>Rule</th>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                {run.rulesBroken.slice(0, 500).map((broken, i) => (
                  <tr key={i}>
                    <td className={styles.n}>{broken.day.toFixed(1)}</td>
                    <td>{RULE_WORDS[broken.rule]}</td>
                    <td>
                      {broken.name}
                      {broken.count > 1 ? ` x${broken.count}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {kills.length ? (
        <section className={styles.section}>
          <h2 className={styles.h2}>Kills</h2>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <tbody>
                {kills.slice(0, 100).map((kill) => (
                  <tr key={kill.id}>
                    <td>{kill.kind}</td>
                    <td className={styles.n}>{kill.count.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <p>
          <Link href="/challenge/leaderboard">Leaderboard</Link>
        </p>
        {mine ? (
          <form action={deleteRun}>
            <input type="hidden" name="id" value={saved.id} />
            <button type="submit" className="btn">
              Remove
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
