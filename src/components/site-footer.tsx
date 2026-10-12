import Link from "next/link";
import { FooterTip } from "./footer-tip";
import { PixelLogo } from "./ui/pixel-logo";
import styles from "./site-footer.module.css";

const DISCORD = "https://discord.gg/bungalo";

/**
 * The foot of every site page (WO-38): who made it, a loading-screen tip as Skyrim shows them,
 * where the community is, and About. Stacks in that order on a phone.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <Link href="/about" className={styles.made}>
          <PixelLogo size={16} />
          <span>Made by Tapps</span>
        </Link>
        <p className={styles.tip}>
          <span className={`label ${styles.tipLabel}`}>Tip</span>
          <FooterTip className={styles.tipText} />
        </p>
        <div className={styles.right}>
          <a href={DISCORD} className={styles.link} target="_blank" rel="noopener noreferrer">
            The LoreRim community gathers on The Modding Bungalo Discord
          </a>
          <Link href="/about" className={styles.link}>
            About
          </Link>
        </div>
        <p className={styles.fine}>Fan-made. Not affiliated with Bethesda or the LoreRim team.</p>
      </div>
    </footer>
  );
}
