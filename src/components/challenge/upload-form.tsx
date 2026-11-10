"use client";

import { useActionState } from "react";
import { uploadRun, type UploadState } from "@/lib/challenge/actions";
import styles from "./challenge.module.css";

/** The run file's upload: one file, one button. The check happens on the server; a refusal says why. */
export function UploadForm() {
  const [state, action, pending] = useActionState<UploadState, FormData>(uploadRun, null);
  return (
    <form action={action} className={styles.upload}>
      <label className={styles.file}>
        <span>Run file</span>
        <input type="file" name="file" accept=".json,application/json" required />
      </label>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Checking" : "Upload"}
      </button>
      {state?.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
