import { Brand } from "./brand";
import styles from "./focus-header.module.css";

/** Header for the creation flow and the editor: brand, what is being edited, status, one or two actions. */
export function FocusHeader({ context, status, actions }: { context: React.ReactNode; status?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <Brand context={context} />
        <div className={styles.right}>
          {status && <span className={styles.status}>{status}</span>}
          {actions}
        </div>
      </div>
    </header>
  );
}
