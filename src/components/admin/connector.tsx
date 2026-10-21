import type { doorCounts } from "@/lib/mcp/door-events";
import styles from "./import-build.module.css";

type Week = Awaited<ReturnType<typeof doorCounts>>[number];

function Counts({ label, rows }: { label: string; rows: [string, number][] }) {
  return (
    <div className={styles.connectorCol}>
      <h4 className="label">{label}</h4>
      {rows.length ? (
        <ul className={styles.connectorList}>
          {rows.map(([k, n]) => (
            <li key={k}>
              <span>{k}</span>
              <span className="muted">{n}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">None.</p>
      )}
    </div>
  );
}

/**
 * The Connector (WO-119): per week, the door's calls by tool, refusals and warnings by code, and drafts
 * finished with warnings still standing, so a change to the instructions shows in the counts.
 */
export function Connector({ weeks }: { weeks: Week[] }) {
  return (
    <section aria-labelledby="connector-title" className={styles.section}>
      <h2 id="connector-title" className="title">
        Connector
      </h2>
      {weeks.length === 0 && <p className="muted">No calls through the connector in the last eight weeks.</p>}
      {weeks.map((w) => (
        <div key={w.week} className={styles.connectorWeek}>
          <h3 className="label">
            Week of {w.week} | {w.finishedWithWarnings} draft{w.finishedWithWarnings === 1 ? "" : "s"} finished with warnings standing
          </h3>
          <div className={styles.connectorCols}>
            <Counts label="Calls by tool" rows={w.calls} />
            <Counts label="Refusals" rows={w.refusals} />
            <Counts label="Warnings" rows={w.warnings} />
          </div>
        </div>
      ))}
    </section>
  );
}
