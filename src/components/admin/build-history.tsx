import type { buildHistory } from "@/lib/builds/revision-queries";
import styles from "./import-build.module.css";

type History = NonNullable<Awaited<ReturnType<typeof buildHistory>>>;

const when = (d: Date) => d.toISOString().slice(0, 16).replace("T", " ") + " UTC";

/**
 * A build's history (WO-122): its last 50 saves, newest first, each with who saved it and what changed from the save
 * before, so a change nobody meant can be found. The build's id goes in the box; the page reads it from ?build=.
 */
export function BuildHistory({ id, history }: { id: string; history: History | null }) {
  return (
    <section aria-labelledby="history-title" className={styles.section}>
      <h2 id="history-title" className="title">
        A build&apos;s saves
      </h2>
      <form className={styles.row} action="/admin#history-title">
        <label className={styles.file}>
          <span className="label">Build id</span>
          <input className="input" name="build" defaultValue={id} maxLength={40} required />
        </label>
        <button type="submit" className="btn">
          Show its saves
        </button>
      </form>
      {id && !history && <p className="muted">No build has the id {id}.</p>}
      {history && (
        <>
          <p>
            {history.build.name}: {history.saves.length === 0 ? "no saves recorded yet." : `the last ${history.saves.length} save${history.saves.length === 1 ? "" : "s"}, newest first.`}
          </p>
          <ol className={styles.history} aria-label={`Saves of ${history.build.name}`}>
            {history.saves.map((s) => (
              <li key={s.id}>
                <span className="muted">{when(s.at)}</span>
                <span>{s.who}</span>
                {s.changes === null ? (
                  <span className="muted">The first save kept.</span>
                ) : s.changes.length ? (
                  <ul>
                    {s.changes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="muted">Saved with no change to the plan.</span>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
