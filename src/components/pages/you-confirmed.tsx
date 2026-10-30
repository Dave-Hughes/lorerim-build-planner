"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { undoConfirmation } from "@/lib/quests/confirm-actions";
import styles from "./page-kit.module.css";

/** "You confirmed this on 30 Oct. Undo" (WO-184 Part 2, board Confirm): the Players line for a player who has confirmed the page. */
export function YouConfirmed({ kind, id, path, at }: { kind: "quest" | "person" | "place"; id: string; path: string; at: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <span className={styles.youConfirmed}>
      You confirmed this on <LocalDate date={at} short />.{" "}
      <button
        type="button"
        className={styles.linkBtn}
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await undoConfirmation(kind, id, path);
            if (!r.ok) return setError(r.error);
            router.refresh();
          })
        }
      >
        Undo
      </button>
      {error && <span role="alert"> {error}</span>}
    </span>
  );
}
