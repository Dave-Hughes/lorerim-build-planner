"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveGuideSection } from "@/lib/builds/actions";
import { saveChapterDoc, writeActChapter } from "@/lib/playthroughs/actions";
import type { GuideDoc } from "@/lib/guide/doc";
import { withoutUnfinishedImages } from "./image-upload";

export type GuideSaveStatus = "idle" | "saving" | "saved" | "failed";

const DELAY = 800;
const RETRY = 5000;

/**
 * What a section belongs to: a build's id, or `p:<id>` for a playthrough's chapter (WO-111), whose
 * key is `chapter:<n>`, or `act:<n>` for an act's chapter not written yet (WO-117: its first word
 * makes it). All save through the same checks (checkGuideDoc, as the Story).
 */
const playthroughOf = (target: string) => (target.startsWith("p:") ? target.slice(2) : null);

function saveSection(target: string, key: string, doc: GuideDoc) {
  const pid = playthroughOf(target);
  if (pid && key.startsWith("act:")) return writeActChapter(pid, Number(key.slice(4)), { doc });
  return pid ? saveChapterDoc(pid, Number(key.replace(/^chapter:/, "")), doc) : saveGuideSection(target, key, doc);
}

/** Where a page that's closing sends a section. */
export function beaconUrl(target: string): string {
  const pid = playthroughOf(target);
  return pid ? `/api/playthroughs/${pid}/chapters` : `/api/builds/${target}/guide`;
}

function storageKey(buildId: string, key: string) {
  return `lorerim-guide:${buildId}:${key}`;
}

/** Text typed but not yet confirmed by the server, kept in this browser. Never throws. */
export function unsavedGuide(buildId: string, key: string): GuideDoc | null {
  try {
    const raw = window.localStorage.getItem(storageKey(buildId, key));
    return raw ? (JSON.parse(raw) as GuideDoc) : null;
  } catch {
    return null;
  }
}

/**
 * Sends a section straight away with `keepalive`, so it still arrives when the page is being left.
 * Clears the browser copy once the server has it (unless it changed since).
 */
function sendNow(buildId: string, key: string, doc: GuideDoc): Promise<boolean> {
  const body = JSON.stringify({ key, doc });
  const post = (keepalive: boolean) => fetch(beaconUrl(buildId), { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive });
  // keepalive bodies are capped at 64 KB; a longer section goes as a plain request.
  return post(body.length < 60_000)
    .catch(() => post(false))
    .then(async (res) => {
      const r = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
      // Saved, or for a level the build no longer has: the browser copy has done its job.
      const done = r.ok || !!r.error?.startsWith("The build has no level");
      if (done && JSON.stringify(unsavedGuide(buildId, key)) === JSON.stringify(doc)) keep(buildId, key, null);
      return r.ok;
    })
    .catch(() => false);
}

/** Saves every section this browser still holds for the build (typed, never confirmed by the server). */
export function saveKeptGuides(buildId: string) {
  let keys: string[] = [];
  try {
    const prefix = storageKey(buildId, "");
    keys = Object.keys(window.localStorage)
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.slice(prefix.length));
  } catch {
    return;
  }
  for (const key of keys) {
    const doc = unsavedGuide(buildId, key);
    if (doc) void sendNow(buildId, key, doc);
  }
}

function keep(buildId: string, key: string, doc: GuideDoc | null) {
  try {
    if (doc) window.localStorage.setItem(storageKey(buildId, key), JSON.stringify(doc));
    else window.localStorage.removeItem(storageKey(buildId, key));
  } catch {
    // Storage full or blocked: the save to the server still runs.
  }
}

/**
 * Autosaves one guide section. Every change is kept in the browser first, so nothing typed
 * is lost on a refresh or a failed save; the browser copy is cleared once the server has it.
 * A failed save retries on its own, except "too long", which waits for the text to change.
 */
export function useGuideAutosave(buildId: string, key: string) {
  const [status, setStatus] = useState<GuideSaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const latest = useRef<GuideDoc | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  // A change the server hasn't confirmed yet.
  const pending = useRef(false);

  const runRef = useRef<() => Promise<void>>(async () => {});
  const schedule = useCallback((ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runRef.current(), ms);
  }, []);

  useEffect(() => {
    runRef.current = async () => {
      const doc = latest.current;
      if (!doc || inFlight.current) return;
      inFlight.current = true;
      setStatus("saving");
      let r: { ok: true } | { ok: false; error: string };
      try {
        // A plain JSON copy: ProseMirror's attribute objects have no prototype, and a server
        // action would pass them as references instead of copying them.
        r = await saveSection(buildId, key, JSON.parse(JSON.stringify(doc)));
      } catch {
        r = { ok: false, error: "Couldn't reach the server. Your text is kept in this browser." };
      }
      inFlight.current = false;
      if (latest.current !== doc) return schedule(DELAY); // Changed while saving: save the newer text.
      if (r.ok) {
        pending.current = false;
        keep(buildId, key, null);
        setStatus("saved");
        setError(null);
      } else {
        setStatus("failed");
        setError(r.error);
        if (!r.error.startsWith("Too long")) schedule(RETRY);
      }
    };
  }, [buildId, key, schedule]);

  const change = useCallback(
    (edited: GuideDoc) => {
      // Images still uploading (or failed) are never saved, here or in the browser copy.
      const doc = withoutUnfinishedImages(edited);
      latest.current = doc;
      pending.current = true;
      keep(buildId, key, doc);
      setStatus((s) => (s === "failed" ? s : "saving"));
      schedule(DELAY);
    },
    [buildId, key, schedule],
  );

  const retry = useCallback(() => schedule(0), [schedule]);

  // Leaving the level, the page or the tab with a change waiting: save it now, not in 800 ms.
  useEffect(() => {
    const flush = () => {
      if (!pending.current || !latest.current) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      pending.current = false;
      void sendNow(buildId, key, latest.current);
    };
    const onHidden = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
      flush();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [buildId, key]);

  return { status, error, change, retry };
}
