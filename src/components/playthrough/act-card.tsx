"use client";

import { useState, useSyncExternalStore } from "react";
import { ReaderLink } from "@/components/reader/reader";
import { readEarly } from "@/lib/playthroughs/actions";
import s from "./play.module.css";

/**
 * An act's story card (WO-116), as the CharacterReader board: at the top of the act on Play, the act's
 * picture, "Act I", its name, the first lines of its chapter, Read Act I and how long it is. Once
 * the player has opened it, one line ("Act I's story ›") with a toggle that brings the card back.
 * Opened is kept on the chapter for the owner (readAt) and in this browser for anyone else.
 */
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key?.startsWith("play:act-read:") && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};
const readKey = (key: string) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

export function ActCard({ runId, chapterId, n, name, picture, focus, lines, length, read, isOwner }: { runId: string; chapterId: number; n: string; name: string; picture: string | null; focus?: { x: number; y: number } | null; lines: string; length: string; read: boolean; isOwner: boolean }) {
  const key = `play:act-read:${runId}:${chapterId}`;
  const here = useSyncExternalStore(
    subscribe,
    () => readKey(key),
    () => false,
  );
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const href = `/p/${runId}/story/${chapterId}`;
  const seen = read || here || opened;
  const open = () => {
    setOpened(true);
    setExpanded(false);
    if (isOwner) void readEarly(runId, chapterId);
    else {
      try {
        localStorage.setItem(key, "1");
      } catch {
        // No storage: it stays open in this visit only.
      }
      listeners.forEach((l) => l());
    }
  };
  if (seen && !expanded)
    return (
      <div className={s.actLine}>
        <ReaderLink href={href} onClick={open} className={s.actLineLink}>
          Act {n}&apos;s story ›
        </ReaderLink>
        <button type="button" className={s.actToggle} aria-expanded={false} onClick={() => setExpanded(true)}>
          Show the card
        </button>
      </div>
    );
  return (
    <div className={s.actCard}>
      {picture && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={picture} alt="" className={s.actCardImage} style={focus ? { objectPosition: `${focus.x}% ${focus.y}%` } : undefined} />
      )}
      <div className={s.actCardFade} aria-hidden="true" />
      <div className={s.actCardIn}>
        <span className={s.actCardN}>Act {n}</span>
        <h2 className={s.actCardName}>{name}</h2>
        {lines && <p className={s.actCardLines}>{lines}</p>}
        <span className={s.actCardFoot}>
          <ReaderLink href={href} onClick={open} className="btn btn-primary">
            Read Act {n}
          </ReaderLink>
          <span className={s.note}>{length}</span>
          {seen && (
            <button type="button" className={s.actToggle} aria-expanded={true} onClick={() => setExpanded(false)}>
              Show one line
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
