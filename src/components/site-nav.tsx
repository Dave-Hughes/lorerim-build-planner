"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFeatures } from "./features";
import styles from "./site-header.module.css";

/** The header's two links (WO-66): Builds and Guide, the current one in ember. */
export function SiteNav() {
  const path = usePathname() ?? "/";
  const guide = path === "/guide" || path.startsWith("/guide/");
  const builds = path === "/";
  // The site guide is held back for launch (WO-81).
  const { siteGuide } = useFeatures();
  return (
    <nav className={styles.nav} aria-label="Site">
      <Link href="/" aria-current={builds ? "page" : undefined}>
        Builds
      </Link>
      {siteGuide && (
        <Link href="/guide" aria-current={guide ? "page" : undefined}>
          Guide
        </Link>
      )}
    </nav>
  );
}
