import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/ui/brand";

/** The site's own 404 (WO-182 Part 5): its tab says so, and its words fit any address, a build's or a page's. */
export const metadata: Metadata = { title: "Nothing here" };

export default function NotFound() {
  return (
    <>
      <header style={{ borderBottom: "1px solid var(--rule)" }}>
        <div className="page" style={{ paddingTop: 14, paddingBottom: 14 }}>
          <Brand />
        </div>
      </header>
      <main className="page" style={{ paddingTop: 56, paddingBottom: 64, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 className="title" style={{ fontSize: 44 }}>
          Nothing here
        </h1>
        <p className="muted">There is no page at this address, or it is a character its author keeps private.</p>
        <p>
          <Link href="/characters">Browse characters</Link>
        </p>
      </main>
    </>
  );
}
