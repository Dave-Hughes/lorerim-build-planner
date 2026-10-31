"use client";

/* eslint-disable @next/next/no-img-element -- the screenshot being added, shown as chosen. */
import { useRef, useState } from "react";
import { SHOT_BYTES, SHOT_WORDS, type ShotKind } from "@/lib/screenshots/words";
import s from "./frame.module.css";

/** The dialog that adds one (board PicAdd): choose a file, say it is yours, send. */
export function AddDialog({ kind, pageKey, name, what, onClose, onDone }: { kind: ShotKind; pageKey: string; name: string; what: string; onClose: () => void; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [size, setSize] = useState("");
  const [own, setOwn] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const choose = (f: File | null) => {
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    if (!f) {
      setFile(null);
      setPreview("");
      return;
    }
    if (f.size > SHOT_BYTES) {
      setFile(null);
      setPreview("");
      return setError(SHOT_WORDS.tooBig);
    }
    if (!/^image\/(png|jpeg)$/.test(f.type)) {
      setFile(null);
      setPreview("");
      return setError(SHOT_WORDS.notAShot);
    }
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setSize(`${img.naturalWidth} by ${img.naturalHeight}`);
    img.src = url;
  };

  const send = async () => {
    if (!file) return setError("Choose a screenshot.");
    if (!own) return setError(SHOT_WORDS.needOwn);
    setBusy(true);
    setError("");
    const form = new FormData();
    form.set("kind", kind);
    form.set("key", pageKey);
    form.set("own", "on");
    form.set("file", file);
    try {
      const res = await fetch("/api/screenshots", { method: "POST", body: form });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) return setError(body.error ?? "That didn't send. Try again.");
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.dim} onClick={onClose}>
      <section className={s.dlg} role="dialog" aria-modal="true" aria-label={`Add a screenshot of ${name}`} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.dh}>Add a screenshot of {name}</h2>
        {preview ? (
          <div className={s.drop}>
            <img src={preview} alt="The screenshot you chose" />
            <div className={s.dropText}>
              <span>
                {file?.name}
                {size ? `, ${size}` : ""}
              </span>
              <button type="button" className={s.link} onClick={() => input.current?.click()}>
                Choose another
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className={`btn ${s.choose}`} onClick={() => input.current?.click()}>
            Choose a screenshot
          </button>
        )}
        <input ref={input} type="file" accept="image/png,image/jpeg" hidden onChange={(e) => choose(e.target.files?.[0] ?? null)} aria-label="Screenshot file" />
        <p className={s.dp}>A screenshot from your own LoreRim game, in daylight, with the HUD hidden and the {what} in view. PNG or JPG, up to 15 MB.</p>
        <label className={s.ck}>
          <input type="checkbox" checked={own} onChange={(e) => setOwn(e.target.checked)} />
          This is my own screenshot, and it shows {name}.
        </label>
        <p className={s.dp}>Every screenshot is checked automatically, and an admin looks at it before anyone else sees it. Until then it shows on the page for you, marked Under review. It&apos;s credited to your Discord name.</p>
        {error && (
          <p role="alert" className={s.err}>
            {error}
          </p>
        )}
        <div className={s.dbtns}>
          <button type="button" className="btn btn-primary" disabled={busy || !file || !own} onClick={send}>
            {busy ? "Sending…" : "Add the screenshot"}
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
