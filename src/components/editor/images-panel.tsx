"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InfoTip } from "@/components/ui/info-tip";
import type { PictureGroup, PictureSlot } from "@/lib/edit/frame";
import * as act from "@/lib/playthroughs/actions";
import f from "./edit-frame.module.css";

/**
 * Images (WO-118), on the Story tab only: "Images ▾" in its top bar opens a panel on the right listing
 * every place in the story an image can go, in story order: the title page and each chapter, grouped
 * as the Contents are. A row never moves when it's filled. Add uploads straight into that place
 * through the same check as every upload. × or Esc closes it; ?images=1 opens the tab with it open.
 * The cover stays in Details, and act images on the act cards in Play.
 */
export function Images({ runId, groups }: { runId: string; groups: PictureGroup[] }) {
  const search = useSearchParams();
  const [open, setOpen] = useState(() => search.get("images") === "1");
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" className={`btn btn-sm ${f.picturesButton}`} aria-expanded={open} onClick={() => setOpen(!open)}>
        Images ▾
      </button>
      {open && (
        <aside className={f.pictures} role="dialog" aria-label="Images">
          <span className={f.picturesHead}>
            <span className={f.picturesTitle}>
              Images{" "}
              <InfoTip label="What's this" text="Every place in this character's story that can show an image. All of them are optional; an empty one uses the act's image or the cover." />
            </span>
            <button type="button" className="btn btn-sm" onClick={() => setOpen(false)}>
              × Close
            </button>
          </span>
          {groups.map((g, i) => (
            <div key={g.label ?? i} className={f.picturesGroup}>
              {g.label && <span className={f.picturesGroupHead}>{g.label}</span>}
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
    const res = await fetch(`/api/playthroughs/${runId}/images`, { method: "POST", body: form }).catch(() => null);
    const body = (await res?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
    if (!body?.url) {
      setBusy(false);
      return setError(body?.error ?? "The upload didn't finish. Try again.");
    }
    const to = slot.to;
    const r = to.kind === "title" ? await act.saveTalePicture(runId, body.url) : await act.saveChapterImage(runId, to.id, body.url);
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
