"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-header.module.css";

/** The header's two links (WO-66): Builds and Guide, the current one in ember. */
export function SiteNav() {
  const path = usePathname() ?? "/";
  const guide = path === "/guide" || path.startsWith("/guide/");
  const builds = path === "/";
  return (
    <nav className={styles.nav} aria-label="Site">
      <Link href="/" aria-current={builds ? "page" : undefined}>
        Builds
      </Link>
      <Link href="/guide" aria-current={guide ? "page" : undefined}>
        Guide
      </Link>
    </nav>
  );
}
