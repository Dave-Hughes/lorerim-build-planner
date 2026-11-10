import Link from "next/link";
import type { SavedRun } from "@/lib/challenge/store";
import type { Run, RunOptions } from "@/lib/challenge/run-file";
import { formatDate } from "@/lib/format/date";
import styles from "./challenge.module.css";

/* eslint-disable @next/next/no-img-element */
const Pixel = ({ name, size }: { name: string; size: number }) => <img className={styles.pixel} src={`/icons/${name}.svg`} alt="" width={size} height={size} />;

const WAYS = [
  ["crafted", "Crafted", "smithing"],
  ["cooked", "Cooked", "challenge-cook"],
  ["brewed", "Brewed", "alchemy"],
  ["mined", "Mined", "weapon-pickaxe"],
  ["chopped", "Chopped", "challenge-chop"],
  ["hunted", "Hunted", "challenge-hunt"],
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

const n = (value: number) => value.toLocaleString("en-US");

/** How many of one item were made, whichever way. */
const itemCount = (item: Run["made"]["items"][number]) => WAYS.reduce((sum, [key]) => sum + (typeof item[key] === "number" ? (item[key] as number) : 0), 0);

/**
 * One player's run, laid out: who and how the rules were kept on the wall at the top, the four counts, what was
 * made by each craft, the rules chosen, then the lists. `foot` is whatever the page puts last (the owner's Remove).
 */
export function RunSheet({ saved, foot }: { saved: SavedRun; foot?: React.ReactNode }) {
  const { run } = saved;
  const oath = saved.mode === "oath";
  const items = [...run.made.items].sort((a, b) => itemCount(b) - itemCount(a) || a.name.localeCompare(b.name));
  const kills = [...run.kills].sort((a, b) => b.count - a.count || a.kind.localeCompare(b.kind));
  return (
    <>
      <header className={styles.band}>
        <div className={`page ${styles.bandInner}`}>
          <Pixel name={oath ? "challenge-oath" : "challenge-honor"} size={96} />
          <div className={styles.bandWords}>
            <h1 className={styles.bandTitle}>{saved.characterName}</h1>
            <p className={styles.bandLine}>
              {oath ? "Oath" : "Honor"}, {saved.race}, level {saved.level}, played by {saved.player}
            </p>
          </div>
        </div>
      </header>
      <main className={`page ${styles.sheet}`}>
        <ul className={styles.counts}>
          <li>
            <strong>{saved.days.toFixed(1)}</strong>
            <span>In-game days</span>
          </li>
          <li>
            <strong>{n(saved.itemsMade)}</strong>
            <span>Items made</span>
          </li>
          <li className={saved.rulesBroken === 0 ? styles.clean : styles.broke}>
            <strong>{n(saved.rulesBroken)}</strong>
            <span>Rules broken</span>
          </li>
          <li>
            <strong>{n(saved.kills)}</strong>
            <span>Kills</span>
          </li>
        </ul>

        <section className={styles.part}>
          <h2 className={styles.title}>Made</h2>
          <ul className={styles.crafts}>
            {WAYS.map(([key, label, icon]) => (
              <li key={key} className={run.made[key] === 0 ? styles.none : undefined}>
                <Pixel name={icon} size={64} />
                <strong>{n(run.made[key])}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {run.options ? (
          <section className={styles.part}>
            <h2 className={styles.title}>Rules chosen</h2>
            <ul className={styles.chosen}>
              {OPTIONS.map(([key, label]) => (
                <li key={key} className={run.options?.[key] ? styles.yes : styles.off}>
                  <span>{label}</span>
                  <b>{run.options?.[key] ? "Allowed" : "Not allowed"}</b>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={styles.lists}>
          <section className={styles.list}>
            <h2 className={styles.listName}>Rules broken</h2>
            {run.rulesBroken.length === 0 ? (
              <p className={styles.clean}>None. A clean run.</p>
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

          {items.length ? (
            <section className={styles.list}>
              <h2 className={styles.listName}>What was made</h2>
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <tbody>
                    {items.slice(0, 200).map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className={styles.n}>{n(itemCount(item))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {kills.length ? (
            <section className={styles.list}>
              <h2 className={styles.listName}>Kills</h2>
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <tbody>
                    {kills.slice(0, 100).map((kill) => (
                      <tr key={kill.id}>
                        <td>{kill.kind}</td>
                        <td className={styles.n}>{n(kill.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>

        <p className={styles.note}>
          Console opened {saved.consoleOpened === 0 ? "never" : `${n(saved.consoleOpened)} times`}. {n(run.plugins.count)} plugins loaded. Written by the mod on {formatDate(saved.writtenAt)}.
        </p>
        <div className={styles.foot}>
          <Link href="/challenge/leaderboard" className="btn">
            Leaderboard
          </Link>
          {foot}
        </div>
      </main>
    </>
  );
}
