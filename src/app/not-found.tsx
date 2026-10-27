import Link from "next/link";
import { Brand } from "@/components/ui/brand";

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
        <p className="muted">That build doesn&apos;t exist, or its author keeps it private.</p>
        <p>
          <Link href="/characters">Browse characters</Link>
        </p>
      </main>
    </>
  );
}
