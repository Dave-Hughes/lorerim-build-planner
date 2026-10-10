"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveGuideSection } from "@/lib/builds/actions";
import type { GuideDoc } from "@/lib/guide/doc";
import { withoutUnfinishedImages } from "./image-upload";

export type GuideSaveStatus = "idle" | "saving" | "saved" | "failed";

const DELAY = 800;
const RETRY = 5000;

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
      let r: Awaited<ReturnType<typeof saveGuideSection>>;
      try {
        // A plain JSON copy: ProseMirror's attribute objects have no prototype, and a server
        // action would pass them as references instead of copying them.
        r = await saveGuideSection(buildId, key, JSON.parse(JSON.stringify(doc)));
      } catch {
        r = { ok: false, error: "Couldn't reach the server. Your text is kept in this browser." };
      }
      inFlight.current = false;
      if (latest.current !== doc) return schedule(DELAY); // Changed while saving: save the newer text.
      if (r.ok) {
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
      keep(buildId, key, doc);
      setStatus((s) => (s === "failed" ? s : "saving"));
      schedule(DELAY);
    },
    [buildId, key, schedule],
  );

  const retry = useCallback(() => schedule(0), [schedule]);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return { status, error, change, retry };
}
