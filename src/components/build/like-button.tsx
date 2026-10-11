"use client";

import { useState, useTransition } from "react";
import { setLike } from "@/lib/builds/actions";
import { Heart, likesLabel } from "./heart";
import styles from "./like-button.module.css";

/**
 * The Like toggle on a shared build. The count changes at once; if the save fails it goes back
 * and a line says why. `signIn` replaces it when signed out; the owner sees only the count.
 */
export function LikeButton({ buildId, liked: initialLiked, count: initialCount, mode, signIn }: { buildId: string; liked: boolean; count: number; mode: "can" | "owner" | "signedOut"; signIn?: React.ReactNode }) {
  const [state, setState] = useState({ liked: initialLiked, count: initialCount });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (mode === "owner")
    return (
      <span className={styles.count} aria-label={likesLabel(state.count)}>
        <Heart /> {state.count}
      </span>
    );
  if (mode === "signedOut") return <span className={styles.wrap}>{signIn}</span>;
  const toggle = () => {
    const before = state;
    const next = { liked: !before.liked, count: Math.max(0, before.count + (before.liked ? -1 : 1)) };
    setState(next);
    setError(null);
    start(async () => {
      const r = await setLike(buildId, next.liked).catch(() => ({ ok: false as const, error: "Couldn't reach the server." }));
      if (r.ok) setState({ liked: r.value.liked, count: r.value.count });
      else {
        setState(before);
        setError(`Not saved. ${r.error}`);
      }
    });
  };
  return (
    <span className={styles.wrap}>
      <button type="button" className={styles.like} aria-pressed={state.liked} aria-busy={pending} onClick={toggle}>
        <Heart filled={state.liked} /> {state.liked ? "Liked" : "Like"} <span className={styles.n}>{state.count}</span>
      </button>
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </span>
  );
}
