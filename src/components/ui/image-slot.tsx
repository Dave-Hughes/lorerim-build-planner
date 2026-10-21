"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { MenuButton } from "@/components/editor/edit-bar";
import menu from "@/components/editor/edit-bar.module.css";
import styles from "./image-slot.module.css";

export type ImageFocus = { x: number; y: number };

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

/** The CSS position for a focus: the part of the image that stays in view. */
export const focusPosition = (f: ImageFocus | null | undefined, fallback = "50% 50%") => (f ? `${f.x}% ${f.y}%` : fallback);

/**
 * One image slot (WO-118): the image as it sits on its page, cropped by its frame, with Change,
 * Position and Remove over it on a dark backing. Position lets the owner drag the image to choose
 * what stays in view; Done ends it and saves. With no image, Add. The parent's frame is
 * position: relative and clips; `imageClassName` sizes the image in it, `toolsClassName` places the
 * buttons. `onFile` uploads a chosen file; `busy` shows while it does.
 */
export function ImageSlot({
  url,
  focus,
  label,
  onFile,
  onRemove,
  onFocus,
  busy = false,
  imageClassName,
  toolsClassName,
  addLabel = "Add an image",
  fallbackPosition,
  positionable = true,
  onUseLink,
  children,
}: {
  url: string | null;
  focus: ImageFocus | null | undefined;
  /** What the image is, for the file input's name: "The cover", "Act I's image". */
  label: string;
  onFile: (file: File) => void;
  onRemove: () => void;
  onFocus: (focus: ImageFocus) => void;
  busy?: boolean;
  imageClassName?: string;
  toolsClassName?: string;
  addLabel?: string;
  fallbackPosition?: string;
  /** Position is offered (WO-118: every slot but the title page, which has no place to keep it). */
  positionable?: boolean;
  /** Change and Add offer Upload or Use a link (WO-118: the cover, which can be a posted screenshot). */
  onUseLink?: () => void;
  /** Drawn between the image and the buttons: a fade, the words over it. */
  children?: React.ReactNode;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const [placing, setPlacing] = useState<ImageFocus | null>(null);
  const drag = useRef<{ x: number; y: number; from: ImageFocus; w: number; h: number } | null>(null);
  const shown = placing ?? focus;
  const pick = (
    <input
      ref={picker}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      aria-label={label}
      tabIndex={-1}
      disabled={busy}
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) onFile(file);
      }}
    />
  );
  // Change (or Add): the file picker, or with a link allowed, a menu of the two.
  const choose = (text: string) =>
    onUseLink ? (
      <MenuButton buttonClassName="btn btn-sm" buttonLabel={text} menuLabel={text} button={busy ? "Uploading" : text}>
        {(close) => (
          <>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={menu.menuItem}
              onClick={() => {
                close();
                picker.current?.click();
              }}
            >
              Upload an image
            </button>
            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={menu.menuItem}
              onClick={() => {
                close();
                onUseLink();
              }}
            >
              Use a link
            </button>
          </>
        )}
      </MenuButton>
    ) : (
      <button type="button" className="btn btn-sm" disabled={busy} onClick={() => picker.current?.click()}>
        {busy ? "Uploading" : text}
      </button>
    );
  if (!url)
    return (
      <>
        {children}
        <span className={`on-image ${toolsClassName ?? ""}`} style={{ zIndex: 3 }}>
          {choose(addLabel)}
          {pick}
        </span>
      </>
    );
  const done = () => {
    if (placing) onFocus(placing);
    setPlacing(null);
  };
  return (
    <>
      <img src={url} alt="" className={imageClassName} style={{ objectPosition: focusPosition(shown, fallbackPosition) }} draggable={false} />
      {children}
      {placing && (
        <span
          className={styles.placing}
          role="presentation"
          onPointerDown={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            drag.current = { x: e.clientX, y: e.clientY, from: placing, w: r.width, h: r.height };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            // Dragging the image right shows more of its left: the focus moves the other way.
            // Both in screen pixels, so the page's zoom (WO-35) cancels out.
            const pct = (v: number) => Math.round(Math.min(100, Math.max(0, v)));
            setPlacing({ x: pct(d.from.x - ((e.clientX - d.x) / d.w) * 100), y: pct(d.from.y - ((e.clientY - d.y) / d.h) * 100) });
          }}
          onPointerUp={() => (drag.current = null)}
        >
          <span className={styles.placingNote}>Drag the image to place it</span>
        </span>
      )}
      <span className={`on-image ${toolsClassName ?? ""}`} style={{ zIndex: 3 }}>
        {!placing && choose("Change")}
        {positionable && (
          <button
            type="button"
            className="btn btn-sm"
            aria-pressed={!!placing}
            disabled={busy}
            onClick={() => (placing ? done() : setPlacing(focus ?? { x: 50, y: 50 }))}
            onKeyDown={(e) => {
              // Arrows nudge the image while placing, for the keyboard.
              if (!placing) return;
              const step = e.shiftKey ? 10 : 2;
              const move: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
              const m = move[e.key];
              if (!m) return;
              e.preventDefault();
              const c = (v: number) => Math.min(100, Math.max(0, v));
              setPlacing({ x: c(placing.x + m[0]), y: c(placing.y + m[1]) });
            }}
          >
            {placing ? "Done" : "Position"}
          </button>
        )}
        <button type="button" className="btn btn-sm" disabled={busy || !!placing} onClick={onRemove}>
          Remove
        </button>
        {pick}
      </span>
    </>
  );
}
