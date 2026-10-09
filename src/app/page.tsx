import { GAME_VERSION } from "@/lib/rules/data";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main className={`page ${styles.main}`}>
      <h1 className="title">Builds</h1>
      <span className={styles.tag}>LoreRim {GAME_VERSION}</span>
      <p className={styles.empty}>No builds yet.</p>
    </main>
  );
}
