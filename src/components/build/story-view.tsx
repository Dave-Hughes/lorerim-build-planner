"use client";

import { useEffect, useRef, useState } from "react";
import { isGuideImageUrl, type GuideDoc, type GuideNode } from "@/lib/guide/doc";
import { draw, guideHeadings } from "@/components/guide/guide-view";
import styles from "./story-view.module.css";

/** A Story image: where it is, what it shows, its caption and size. */
interface Plate {
  src: string;
  alt: string;
  caption: string | null;
  width?: number;
  height?: number;
}

function plateOf(n: GuideNode): Plate | null {
  const a = n.attrs ?? {};
  if (n.type !== "image" || typeof a.src !== "string" || !isGuideImageUrl(a.src)) return null;
  return {
    src: a.src,
    alt: typeof a.alt === "string" ? a.alt : "",
    caption: typeof a.caption === "string" && a.caption.trim() ? a.caption.trim() : null,
    width: typeof a.width === "number" ? a.width : undefined,
    height: typeof a.height === "number" ? a.height : undefined,
  };
}

/** The Story's images, in order: the tab's "4 images". */
export function storyImages(doc: GuideDoc): number {
  return doc.content.filter((n) => plateOf(n)).length;
}

/** A small brass ornament: a line, a diamond, a line. */
function Ornament({ filled = false, wide = false }: { filled?: boolean; wide?: boolean }) {
  const w = wide ? 160 : 120;
  const mid = w / 2;
  return (
    <svg className={styles.ornament} width={w} height="14" viewBox={`0 0 ${w} 14`} aria-hidden="true">
      <line x1="0" y1="7" x2={mid - 12} y2="7" />
      <rect x={mid - 5} y="2" width="10" height="10" transform={`rotate(45 ${mid} 7)`} className={filled ? styles.ornamentFill : undefined} />
      <line x1={mid + 12} y1="7" x2={w} y2="7" />
    </svg>
  );
}

/**
 * The Story tab (WO-79): the build's tale, set as a book. The first image is the opening plate, with
 * the title and opening line over its lower edge; the text is a 680px page in Alegreya with a brass
 * drop cap; images are 1000px plates (two in a row sit side by side) that open in a viewer; a quote
 * the author marks sits large between two ornaments; at the end, the character and the way to the levels.
 */
export function StoryView({ doc, title, line, character, onFollow }: { doc: GuideDoc; title: string; line: string; character: string; onFollow: () => void }) {
  const plates: Plate[] = [];
  const top = doc.content.map((n) => {
    const p = plateOf(n);
    if (p) plates.push(p);
    return p ? plates.length - 1 : -1;
  });
  const opening = plates.length ? 0 : -1;
  const [view, setView] = useState<number | null>(null);
  const ids = new Map<number, string>();
  const headings = guideHeadings(doc, "story");
  let h = 0;
  doc.content.forEach((n, i) => {
    if (n.type === "heading" && n.attrs?.level === 2) ids.set(i, headings[h++].id);
  });

  // The blocks after the opening plate: runs of images become rows of two.
  const blocks: React.ReactNode[] = [];
  let capped = false;
  for (let i = 0; i < doc.content.length; i++) {
    const n = doc.content[i];
    const at = top[i];
    if (at === opening && at !== -1) continue;
    if (at !== -1) {
      const run: number[] = [at];
      while (i + 1 < doc.content.length && top[i + 1] !== -1 && run.length < 2) run.push(top[++i]);
      blocks.push(
        <div key={`plates-${at}`} className={run.length > 1 ? styles.pair : styles.single}>
          {run.map((k) => (
            <PlateFigure key={k} plate={plates[k]} n={k + 1} of={plates.length} onOpen={() => setView(k)} />
          ))}
        </div>,
      );
      continue;
    }
    if (n.type === "paragraph" && !capped && (n.content ?? []).some((c) => c.type === "text" && c.text?.trim())) {
      capped = true;
      blocks.push(
        <p key={i} className={`${styles.text} ${styles.first}`}>
          {(n.content ?? []).map((c, j) => draw(c, `${i}.${j}`, ids))}
        </p>,
      );
      continue;
    }
    if (n.type === "blockquote") {
      blocks.push(
        <blockquote key={i} className={styles.quote}>
          <Ornament />
          <div className={styles.quoteText}>{(n.content ?? []).map((c, j) => draw(c, `${i}.${j}`, ids))}</div>
          <Ornament />
        </blockquote>,
      );
      continue;
    }
    blocks.push(
      <div key={i} className={styles.text}>
        {draw(n, String(i), ids, i)}
      </div>,
    );
  }

  const open = opening !== -1 ? plates[opening] : null;
  return (
    <section aria-label="Story" className={styles.story}>
      <header className={`${styles.opening} ${open ? "" : styles.openingPlain}`}>
        {open && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={open.src} alt={open.alt} className={styles.openingImage} />
        )}
        <div className={styles.openingFade} aria-hidden="true" />
        <div className={styles.openingWords}>
          <h2 className={styles.title}>{title}</h2>
          {line && <p className={styles.line}>{line}</p>}
        </div>
        {open && (
          <button type="button" className={styles.openingButton} aria-label={`Open image 1 of ${plates.length}`} onClick={() => setView(0)} />
        )}
      </header>
      <div className={styles.body}>{blocks}</div>
      <footer className={styles.end}>
        <Ornament filled wide />
        <p className={styles.character}>{character}</p>
        <button type="button" className={styles.follow} onClick={onFollow}>
          Follow the build level by level ›
        </button>
      </footer>
      {view !== null && <Viewer plates={plates} at={view} onAt={setView} onClose={() => setView(null)} />}
    </section>
  );
}

function PlateFigure({ plate, n, of, onOpen }: { plate: Plate; n: number; of: number; onOpen: () => void }) {
  return (
    <figure className={styles.plate}>
      <div className={`frame ${styles.plateFrame}`}>
        <button type="button" className={styles.plateButton} aria-label={`Open image ${n} of ${of}`} onClick={onOpen}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={plate.src} alt={plate.alt} width={plate.width} height={plate.height} loading="lazy" decoding="async" />
        </button>
      </div>
      {plate.caption && <figcaption className={styles.caption}>{plate.caption}</figcaption>}
    </figure>
  );
}

/** An image full screen, with its caption, ‹ ›, the arrow keys, "2 of 4", Esc to close, and a swipe on phones. */
function Viewer({ plates, at, onAt, onClose }: { plates: Plate[]; at: number; onAt: (n: number) => void; onClose: () => void }) {
  const p = plates[at];
  const go = (d: number) => onAt((at + d + plates.length) % plates.length);
  const close = useRef<HTMLButtonElement>(null);
  const goRef = useRef(go);
  const closeRef = useRef(onClose);
  useEffect(() => {
    goRef.current = go;
    closeRef.current = onClose;
  });
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      else if (e.key === "ArrowLeft") goRef.current(-1);
      else if (e.key === "ArrowRight") goRef.current(1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      back?.focus();
    };
  }, []);
  const touch = useRef<number | null>(null);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className={styles.viewer}
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const x = e.changedTouches[0]?.clientX;
        if (touch.current !== null && x !== undefined && Math.abs(x - touch.current) > 40) go(x < touch.current ? 1 : -1);
        touch.current = null;
      }}
    >
      <button ref={close} type="button" className={styles.viewerClose} aria-label="Close" onClick={onClose}>
        ×
      </button>
      <div className={styles.viewerRow}>
        {plates.length > 1 && (
          <button type="button" className={styles.viewerArrow} aria-label="Previous image" onClick={() => go(-1)}>
            ‹
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.src} alt={p.alt} className={styles.viewerImage} />
        {plates.length > 1 && (
          <button type="button" className={styles.viewerArrow} aria-label="Next image" onClick={() => go(1)}>
            ›
          </button>
        )}
      </div>
      {p.caption && <p className={styles.viewerCaption}>{p.caption}</p>}
      <p className={styles.viewerCount} aria-live="polite">
        {at + 1} of {plates.length}
      </p>
    </div>
  );
}
