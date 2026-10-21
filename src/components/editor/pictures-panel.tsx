"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PictureGroup, PictureSlot } from "@/lib/edit/frame";
import * as act from "@/lib/playthroughs/actions";
import f from "./edit-frame.module.css";

/**
 * Pictures (WO-117), as the EditPictures board: in the edit band on every edit tab, "Pictures 3 of 16
 * ▾" opens a panel on the right listing every place a picture can go, grouped and in story order:
 * the cover, the title page and each chapter, each act's card and its entries and beats. Add uploads
 * straight into that place through the same check as every upload. × or Esc closes it; ?pictures=1
 * opens edit with it open (an assistant's addPictures link).
 */
export function Pictures({ runId, groups }: { runId: string; groups: PictureGroup[] }) {
  const search = useSearchParams();
  const [open, setOpen] = useState(() => search.get("pictures") === "1");
  const all = groups.flatMap((g) => g.slots);
  const filled = all.filter((x) => x.url).length;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" className={`btn btn-sm ${f.picturesButton}`} aria-expanded={open} onClick={() => setOpen(!open)}>
        Images {filled} of {all.length} ▾
      </button>
      {open && (
        <aside className={f.pictures} role="dialog" aria-label="Images">
          <span className={f.picturesHead}>
            <span className={f.picturesTitle}>
              Images {filled} of {all.length}
            </span>
            <button type="button" className="btn btn-sm" onClick={() => setOpen(false)}>
              × Close
            </button>
          </span>
          {groups.map((g) => (
            <div key={g.label} className={f.picturesGroup}>
              <span className={f.picturesGroupHead}>{g.label}</span>
              {g.slots.map((slot) => (
                <PictureRow key={slot.key} runId={runId} slot={slot} />
              ))}
            </div>
          ))}
          <p className="muted" style={{ fontSize: 13 }}>
            Each image is checked before it shows.
          </p>
        </aside>
      )}
    </>
  );
}

function PictureRow({ runId, slot }: { runId: string; slot: PictureSlot }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    // The cover is the build's, uploaded as Set up uploads it; the rest are the run's images.
    const res = await fetch(slot.to.kind === "cover" ? "/api/covers" : `/api/playthroughs/${runId}/images`, { method: "POST", body: form }).catch(() => null);
    const body = (await res?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
    if (!body?.url) {
      setBusy(false);
      return setError(body?.error ?? "The upload didn't finish. Try again.");
    }
    const url = body.url;
    const to = slot.to;
    const r =
      to.kind === "cover"
        ? await act.saveCover(runId, url)
        : to.kind === "title"
          ? await act.saveTalePicture(runId, url)
          : to.kind === "act"
            ? await act.saveActImage(runId, to.id, url)
            : await act.saveChapterImage(runId, to.id, url);
    setBusy(false);
    if (r.ok) router.refresh();
    else setError(r.error);
  };
  return (
    <div className={f.pictureRow}>
      {slot.url ? <img src={slot.url} alt="" className={f.pictureThumb} /> : <span className={f.pictureEmpty} aria-hidden="true">+</span>}
      <span className={f.pictureName}>
        {slot.label}
        {error && <span className={f.saveBad}>{error}</span>}
      </span>
      <label className="btn btn-sm" style={{ cursor: "pointer" }}>
        {busy ? "Uploading" : slot.url ? "Change" : "Add"}
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label={`${slot.url ? "Change" : "Add"} ${slot.label}`} disabled={busy} onChange={(e) => void upload(e.target.files?.[0])} />
      </label>
    </div>
  );
}
