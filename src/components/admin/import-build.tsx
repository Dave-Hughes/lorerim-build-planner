"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { importBuild } from "@/lib/builds/transfer-actions";
import styles from "./import-build.module.css";

/**
 * Import a build (WO-90): a file another environment's Export made. The build is created here, owned
 * by you, and its page opens with its new id (the one SAMPLE_BUILD_ID wants).
 */
export function ImportBuild() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const go = () => {
    if (!file) return;
    setError(null);
    start(async () => {
      const r = await importBuild(await file.text());
      if (!r.ok) return setError(r.error);
      const q = new URLSearchParams({ imported: "1" });
      if (r.value.skipped.length) q.set("skipped", String(r.value.skipped.length));
      if (r.value.droppedTags.length) q.set("dropped", r.value.droppedTags.join(","));
      router.push(`/b/${r.value.id}?${q}`);
    });
  };
  return (
    <section aria-labelledby="import-title" className={styles.section}>
      <h2 id="import-title" className="title">
        Import a build
      </h2>
      <p className="muted">A .lorerim-build.json file from a build&apos;s Export. It becomes a new build owned by you, with its cover and guide images copied here.</p>
      <div className={styles.row}>
        <label className={styles.file}>
          <span className="label">Build file</span>
          <input type="file" accept=".json,application/json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button type="button" className="btn btn-primary" onClick={go} disabled={!file || pending}>
          {pending ? "Importing…" : "Import"}
        </button>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </section>
  );
}
