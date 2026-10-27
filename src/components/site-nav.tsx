"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFeatures } from "./features";
import styles from "./site-header.module.css";

/** The header's links (WO-66): Builds, Quests (WO-100), People and Places (WO-154), Playthroughs (WO-111), Gear (WO-92) and Guide, the current one in ember. */
export function SiteNav() {
  const path = usePathname() ?? "/";
  const guide = path === "/guide" || path.startsWith("/guide/");
  const builds = path === "/";
  const gearHere = path === "/gear" || path.startsWith("/gear/");
  const questsHere = path === "/quests" || path.startsWith("/quests/");
  const peopleHere = path === "/people" || path.startsWith("/people/");
  const placesHere = path === "/places" || path.startsWith("/places/");
  const playHere = path === "/playthroughs" || path.startsWith("/playthroughs/") || path.startsWith("/p/");
  // The site guide is held back for launch (WO-81).
  const { siteGuide, gear, quests, playthroughs } = useFeatures();
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
      {quests && (
        <Link href="/people" aria-current={peopleHere ? "page" : undefined}>
          People
        </Link>
      )}
      {quests && (
        <Link href="/places" aria-current={placesHere ? "page" : undefined}>
          Places
        </Link>
      )}
      {playthroughs && (
        <Link href="/playthroughs" aria-current={playHere ? "page" : undefined}>
          Playthroughs
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
