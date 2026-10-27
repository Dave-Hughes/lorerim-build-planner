import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page" style={{ paddingTop: 56, paddingBottom: 64, display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 className="title" style={{ fontSize: 44 }}>
        Nothing here
      </h1>
      <p className="muted">That build doesn&apos;t exist, or its author keeps it private.</p>
      <p>
        <Link href="/characters">Browse characters</Link>
      </p>
    </main>
  );
}
