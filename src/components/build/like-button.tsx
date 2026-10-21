"use client";

import { useState, useTransition } from "react";
import { setLike } from "@/lib/builds/actions";
import { Heart } from "./heart";
import styles from "./like-button.module.css";

/** The burst's pixel heart: rows of a 7×6 grid, drawn with the icons' dark outline. */
const HEART_ROWS = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];
const HEART_CELLS = HEART_ROWS.flatMap((row, y) => [...row].flatMap((c, x) => (c === "X" ? [[x, y]] : [])));
const HEART_OUTLINE = (() => {
  const filled = new Set(HEART_CELLS.map(([x, y]) => `${x},${y}`));
  const out = new Set<string>();
  for (const [x, y] of HEART_CELLS)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (!filled.has(k)) out.add(k);
    }
  return [...out].map((k) => k.split(",").map(Number));
})();

function PixelHeart({ color }: { color: string }) {
  return (
    <svg width="18" height="16" viewBox="-1 -1 9 8" shapeRendering="crispEdges" aria-hidden="true">
      {HEART_OUTLINE.map(([x, y]) => (
        <rect key={`o${x},${y}`} x={x} y={y} width="1" height="1" fill="#06080b" />
      ))}
      {HEART_CELLS.map(([x, y]) => (
        <rect key={`f${x},${y}`} x={x} y={y} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
}

/** The Destiny four-point star, small: the burst's sparks. */
function Spark({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M11 1 L13 9 L21 11 L13 13 L11 21 L9 13 L1 11 L9 9 Z" fill={color} />
    </svg>
  );
}

const COLORS = ["#f0913f", "#d07a6a", "#b9a173"];
/** Where each piece flies: a fixed spread (angle, distance 30–70px, a little turn), never random in render. */
const PIECES = Array.from({ length: 18 }, (_, i) => {
  const heart = i < 12;
  const n = heart ? i : i - 12;
  const angle = ((heart ? n * 30 + ((n * 7) % 11) - 5 : n * 60 + 15) * Math.PI) / 180;
  const dist = heart ? 34 + ((n * 13) % 37) : 46 + ((n * 17) % 25);
  return { heart, color: COLORS[(i * 2) % 3], x: Math.round(Math.cos(angle) * dist), y: Math.round(Math.sin(angle) * dist), turn: ((i * 37) % 60) - 30, delay: (i % 4) * 18 };
});

/**
 * The Like toggle on a shared build. The count changes at once; if the save fails it goes back
 * and a line says why. `signIn` replaces it when signed out. Owners can like their own build, a private
 * one too (WO-118: nobody else can see it to like it).
 *
 * Liking should feel good (WO-36): the heart pops and turns rose, a burst of pixel hearts and
 * sparks flies out (an overlay that takes no clicks and moves nothing), a ring pulses, and the count
 * rolls up. Unliking is quiet: the fill drains and the count rolls down. Reduced motion: just the
 * fill and the new number.
 */
export function LikeButton({ buildId, liked: initialLiked, count: initialCount, mode, signIn }: { buildId: string; liked: boolean; count: number; mode: "can" | "signedOut"; signIn?: React.ReactNode }) {
  const [state, setState] = useState({ liked: initialLiked, count: initialCount });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  // Each like (not an unlike) plays the burst once: a new key remounts it.
  const [burst, setBurst] = useState(0);
  // The count's roll: the number it came from and which way.
  const [roll, setRoll] = useState<{ from: number; dir: "up" | "down"; key: number } | null>(null);
  if (mode === "signedOut") return <span className={styles.wrap}>{signIn}</span>;
  const toggle = () => {
    const before = state;
    const next = { liked: !before.liked, count: Math.max(0, before.count + (before.liked ? -1 : 1)) };
    setState(next);
    setRoll((r) => ({ from: before.count, dir: next.liked ? "up" : "down", key: (r?.key ?? 0) + 1 }));
    if (next.liked) setBurst((b) => b + 1);
    setError(null);
    start(async () => {
      const r = await setLike(buildId, next.liked).catch(() => ({ ok: false as const, error: "Couldn't reach the server." }));
      if (r.ok) setState({ liked: r.value.liked, count: r.value.count });
      else {
        setState(before);
        setRoll(null);
        setError(`Not saved. ${r.error}`);
      }
    });
  };
  return (
    <span className={styles.wrap}>
      <button type="button" className={`${styles.like} ${state.liked ? styles.isLiked : ""}`} aria-pressed={state.liked} aria-busy={pending} onClick={toggle}>
        <span className={styles.heartBox}>
          {burst > 0 && state.liked && (
            <span key={burst} className={styles.burst} aria-hidden="true">
              <span className={styles.ring} />
              {PIECES.map((p, i) => (
                <span
                  key={i}
                  className={styles.piece}
                  style={{ ["--x" as string]: `${p.x}px`, ["--y" as string]: `${p.y}px`, ["--turn" as string]: `${p.turn}deg`, animationDelay: `${p.delay}ms` }}
                >
                  {p.heart ? <PixelHeart color={p.color} /> : <Spark color={p.color} />}
                </span>
              ))}
            </span>
          )}
          <span key={state.liked ? `on-${burst}` : `off-${roll?.key ?? 0}`} className={`${styles.heart} ${state.liked ? (burst ? styles.pop : "") : roll ? styles.drain : ""}`}>
            <Heart filled={state.liked} />
          </span>
        </span>
        {state.liked ? "Liked" : "Like"}{" "}
        <span className={styles.n}>
          {roll && roll.from !== state.count ? (
            // The old number is drawn by CSS from data-from, so the button's text is only ever the count.
            <span key={roll.key} className={`${styles.roll} ${roll.dir === "up" ? styles.up : styles.down}`} data-from={roll.from} onAnimationEnd={(e) => e.target === e.currentTarget && setRoll(null)}>
              {state.count}
            </span>
          ) : (
            state.count
          )}
        </span>
      </button>
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </span>
  );
}
