"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFeatures } from "./features";
import styles from "./site-header.module.css";

/** The header's links (WO-66): Builds, Quests (WO-100), Gear (WO-92) and Guide, the current one in ember. */
export function SiteNav() {
  const path = usePathname() ?? "/";
  const guide = path === "/guide" || path.startsWith("/guide/");
  const builds = path === "/";
  const gearHere = path === "/gear" || path.startsWith("/gear/");
  const questsHere = path === "/quests" || path.startsWith("/quests/");
  // The site guide is held back for launch (WO-81).
  const { siteGuide, gear, quests } = useFeatures();
  return (
    <nav className={styles.nav} aria-label="Site">
      <Link href="/" aria-current={builds ? "page" : undefined}>
        Builds
      </Link>
      {quests && (
        <Link href="/quests" aria-current={questsHere ? "page" : undefined}>
          Quests
        </Link>
      )}
      {gear && (
        <Link href="/gear" aria-current={gearHere ? "page" : undefined}>
          Gear
        </Link>
      )}
      {siteGuide && (
        <Link href="/guide" aria-current={guide ? "page" : undefined}>
          Guide
        </Link>
      )}
    </nav>
  );
}
