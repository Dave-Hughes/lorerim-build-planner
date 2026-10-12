"use client";

/* eslint-disable @next/next/no-img-element -- four tiny SVG frames stacked; next/image adds nothing here. */
import { useEffect, useState } from "react";
import styles from "./pixel-logo.module.css";

/** The glint's frames after rest (logo-0): white heart, stretch with rays, four points, rest. ~90ms each. */
const GLINT = [1, 2, 3, 0];
const FRAME_MS = 90;
const EVERY_MS = 10_000;

/**
 * The pixel-art star (WO-38): gold with an ember heart, drawn 16×16 in the icons' style
 * (public/icons/logo-0..3.svg). With `glint`, every 10 seconds it glints, unless the tab is hidden or
 * the player prefers reduced motion. All four frames are stacked and only one shows, so a frame
 * never waits on a download.
 */
export function PixelLogo({ size = 32, glint = false }: { size?: number; glint?: boolean }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!glint) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers: number[] = [];
    const id = window.setInterval(() => {
      if (document.hidden || still.matches) return;
      GLINT.forEach((f, i) => timers.push(window.setTimeout(() => setFrame(f), (i + 1) * FRAME_MS)));
    }, EVERY_MS);
    return () => {
      window.clearInterval(id);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [glint]);
  return (
    <span className={styles.logo} style={{ width: size, height: size }} aria-hidden="true" data-frame={frame}>
      {[0, 1, 2, 3].map((f) => (
        <img key={f} src={`/icons/logo-${f}.svg`} width={size} height={size} alt="" className={f === frame ? styles.on : styles.off} />
      ))}
    </span>
  );
}
