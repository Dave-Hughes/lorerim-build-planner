"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { readFromSave } from "@/lib/playthroughs/actions";
import type { Detect } from "@/lib/playthroughs/types";
import type { SaveRead } from "@/lib/save/read";
import s from "./play.module.css";

/**
 * Read a save (WO-112): the owner picks a .ess file and the reader runs here, in the browser; the file
 * never leaves the PC (and it's far over the server's upload limit). What it found is shown with Use
 * this and Cancel; Use this saves it as the snapshot, labelled from the save's number. A save of
 * someone else is said plainly, and Use this asks first.
 */
export function ReadSave({ id, characters, objectives, skills }: {
  id: string;
  /** The character's names: the run's, which is the one said, and the build's. */
  characters: string[];
  /** The run's quest objectives the save can tick. */
  objectives: { detect: Detect }[];
  /** The skills the last snapshot holds; a save doesn't carry them, so they're kept. */
  skills: Record<string, number>;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [read, setRead] = useState<SaveRead | null>(null);
  const [reading, setReading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setRead(null);
    setAsking(false);
    setReading(true);
    try {
      const [{ readSave, SaveError }, forms] = await Promise.all([import("@/lib/save/read"), import("@/data/lorerim-5.0.4.8/quest_forms.json")]);
      try {
        setRead(readSave(new Uint8Array(await file.arrayBuffer()), forms.default as Record<string, string>));
      } catch (e) {
        setError(e instanceof SaveError ? e.message : "That file didn't read as a Skyrim save.");
      }
    } finally {
      setReading(false);
      if (input.current) input.current.value = "";
    }
  };

  const someoneElse = read && !characters.some((c) => c.trim().toLowerCase() === read.name.trim().toLowerCase());
  const ticks = read ? objectives.filter((o) => (read.quests[o.detect.quest]?.stage ?? -1) >= (o.detect.stage ?? 0)).length : 0;

  const use = () =>
    start(async () => {
      if (!read) return;
      const questStages = Object.fromEntries(Object.entries(read.quests).flatMap(([k, q]) => (k.length <= 80 && q.stage <= 10_000 ? [[k, q.stage]] : [])));
      const r = await readFromSave(id, { label: `Save ${read.saveNumber}`, level: read.level, xp: read.xp, day: read.day, place: read.place || null, skills: read.skills ?? skills, questStages, ...(read.counts ? { counts: read.counts } : {}) });
      if (!r.ok) setError(r.error ?? "That didn't save. Try again.");
      else {
        setRead(null);
        setAsking(false);
        router.refresh();
      }
    });

  return (
    <>
      <button type="button" className={s.linkButton} onClick={() => input.current?.click()} disabled={reading}>
        {reading ? "Reading the save" : "Read a save"}
      </button>
      <input ref={input} type="file" accept=".ess" hidden aria-label="A save file (.ess)" onChange={(e) => pick(e.target.files?.[0])} />
      {(read || error) && (
        <div className={s.form} role="region" aria-label="What the save says" style={{ gridColumn: "1 / -1" }}>
          {read && (
            <>
              <p>
                <strong>{read.name}</strong>, level {read.level}, day {read.day}
                {read.place ? `, ${read.place}` : ""}. Save {read.saveNumber}.
                {read.counts?.lute !== undefined ? ` Lute ${read.counts.lute}.` : ""}
              </p>
              <p className="muted">
                {objectives.length
                  ? `It would tick ${ticks} of this run's ${objectives.length} quest objective${objectives.length === 1 ? "" : "s"}.`
                  : "This run has no quest objectives for it to tick."}{" "}
                {read.skills ? `It reads ${Object.keys(read.skills).length} skills.` : "It couldn’t read the skills from this save; your last ones stay."}
              </p>
              {someoneElse && (
                <p role="alert" className={s.error}>
                  This save is {read.name}, not {characters[0]}.
                </p>
              )}
              <div className={s.formActions}>
                {asking ? (
                  <>
                    <span>Use {read.name}&rsquo;s save for {characters[0]}?</span>
                    <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={use}>
                      Use it
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => (someoneElse ? setAsking(true) : use())}>
                    Use this
                  </button>
                )}
                <button type="button" className="btn btn-sm" onClick={() => { setRead(null); setAsking(false); }}>
                  Cancel
                </button>
              </div>
            </>
          )}
          {error && (
            <p role="alert" className={s.error}>
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}
