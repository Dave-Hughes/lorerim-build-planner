"use client";

/* eslint-disable @next/next/no-img-element -- the screenshots are shown as sent, at their own sizes. */
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { approveScreenshot, deleteScreenshot, leadScreenshot, removeScreenshot } from "@/lib/screenshots/actions";
import type { ShotData } from "@/lib/screenshots/view";
import { checkWords, noShotYet, shotCaption, SHOT_BYTES, SHOT_WORDS, type ShotKind } from "@/lib/screenshots/words";
import s from "./shot-gallery.module.css";

/**
 * The screenshots of a place or a person (WO-184 Part 1, boards PicPlace, PicYours, PicAdd, PicAdmin and PicPerson): the lead one at 16:9, black bars when a
 * screenshot isn't, with the map beside it on a place, then a strip of every one shown and an Add tile. A screenshot waiting on an admin shows to its sender
 * and the admins, marked Under review.
 */
export function ShotGallery({ kind, pageKey, name, data, signInEmpty, signInStrip, layout, map }: { kind: ShotKind; pageKey: string; name: string; data: { shots: ShotData[]; signedIn: boolean; admin: boolean }; signInEmpty: ReactNode; signInStrip: ReactNode; layout: "band" | "person"; map?: ReactNode }) {
  const router = useRouter();
  const { shots, signedIn, admin } = data;
  const [at, setAt] = useState(0);
  const [adding, setAdding] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const cur = shots[Math.min(at, Math.max(0, shots.length - 1))];
  const what = kind === "place" ? "place" : "person";

  const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) return setError(r.error);
      setError("");
      setConfirming(false);
      setAt(0);
      router.refresh();
    });

  const figure = cur ? (
    <figure className={s.shot}>
      <img src={cur.url} alt={`${name}, a screenshot by ${cur.byName ?? "a player"}`} />
      {cur.status === "review" && <span className={s.flag}>{cur.reported ? "Reported" : "Under review"}</span>}
      {admin && cur.status === "review" && (
        <span className={s.pin}>
          <button type="button" className={s.tool} disabled={pending} onClick={() => run(() => approveScreenshot(cur.id))}>
            Approve
          </button>
          <button type="button" className={`${s.tool} ${s.red}`} disabled={pending} onClick={() => run(() => removeScreenshot(cur.id))}>
            Remove
          </button>
        </span>
      )}
      {admin && cur.status === "live" && cur.reported && (
        <span className={s.pin}>
          <button type="button" className={s.tool} disabled={pending} onClick={() => run(() => approveScreenshot(cur.id))}>
            Keep it
          </button>
          <button type="button" className={`${s.tool} ${s.red}`} disabled={pending} onClick={() => run(() => removeScreenshot(cur.id))}>
            Remove
          </button>
        </span>
      )}
      <figcaption className={s.cap}>
        {cur.mine && cur.status === "review" ? (
          <>
            {cur.byImage ? <img className={s.av} src={cur.byImage} alt="" /> : <span className={s.av} />}
            Your screenshot
            <span className={s.n}>Only you can see it until an admin approves it</span>
          </>
        ) : (
          <>
            {cur.byImage ? <img className={s.av} src={cur.byImage} alt="" /> : <span className={s.av} />}
            {shotCaption(cur.byName)}
            {admin && cur.status === "review" && <span className={s.when}>, <LocalDate date={cur.at} short /></span>}
            <span className={s.n}>
              {admin && cur.status === "review" ? `${checkWords(cur.check)}. ` : ""}
              {Math.min(at, shots.length - 1) + 1} of {shots.length}
            </span>
          </>
        )}
      </figcaption>
    </figure>
  ) : (
    <div className={`${s.shot} ${s.empty}`}>
      <span>{noShotYet(name)}</span>
      {signedIn ? (
        <button type="button" className="btn btn-sm" onClick={() => setAdding(true)}>
          + Add a screenshot
        </button>
      ) : (
        signInEmpty
      )}
    </div>
  );

  const strip = (
    <div className={`${s.strip} ${layout === "person" ? s.stripPerson : ""}`}>
      <span className={s.k}>Screenshots</span>
      {shots.map((x, i) => (
        <span key={x.id} className={s.thWrap}>
          <button type="button" className={`${s.th} ${i === Math.min(at, shots.length - 1) ? s.on : ""}`} aria-label={`Screenshot ${i + 1}, ${x.status === "review" ? "under review" : `by ${x.byName ?? "a player"}`}${i === 0 && x.status === "live" ? ", leads the page" : ""}`} onClick={() => setAt(i)}>
            <img src={x.thumbUrl} alt="" />
            {x.status === "review" && <span className={s.flagSm}>Review</span>}
          </button>
          {admin && i === 0 && x.status === "live" && shots.length > 1 && <span className={s.leads}>Leads the page</span>}
          {admin && x.status === "review" && <span className={s.flagText}>Under review</span>}
        </span>
      ))}
      {signedIn ? (
        <button type="button" className={s.add} onClick={() => setAdding(true)}>
          + Add a screenshot
        </button>
      ) : (
        signInStrip
      )}
      <span className={s.right}>
        {cur?.mine && cur.status === "review" ? (
          <>
            You added this on <LocalDate date={cur.at} short />.{" "}
            <button type="button" className={s.link} disabled={pending} onClick={() => run(() => removeScreenshot(cur.id))}>
              Remove it
            </button>
          </>
        ) : admin && cur && cur.status === "live" ? (
          <>
            <button type="button" className="btn btn-sm" disabled={pending || cur.lead || shots[0]?.id === cur.id} onClick={() => run(() => leadScreenshot(cur.id))}>
              Make this lead
            </button>
            <button type="button" className={`btn btn-sm ${s.redBtn}`} disabled={pending} onClick={() => setConfirming(true)}>
              Delete
            </button>
          </>
        ) : (
          shots.length > 0 && <span className={s.note}>Players&apos; own screenshots, checked before they show.</span>
        )}
      </span>
      {confirming && cur && (
        <div className={s.pop} role="alertdialog" aria-label="Delete this screenshot?">
          <strong>Delete this screenshot?</strong>
          <span className={s.note}>It goes from the page for everyone. {cur.byName ?? "The player"} is told it was removed.</span>
          <span className={s.popBtns}>
            <button type="button" className={`btn btn-sm ${s.redBtn}`} disabled={pending} onClick={() => run(() => deleteScreenshot(cur.id))}>
              Delete
            </button>
            <button type="button" className="btn btn-sm" onClick={() => setConfirming(false)}>
              Keep it
            </button>
          </span>
        </div>
      )}
      {error && (
        <span role="alert" className={s.err}>
          {error}
        </span>
      )}
    </div>
  );

  return (
    <>
      {layout === "band" ? (
        <div className={`${s.pair} ${map ? "" : s.alone}`}>
          {figure}
          {map ? <div className={s.mapcell}>{map}</div> : null}
        </div>
      ) : (
        figure
      )}
      {layout === "band" || shots.length > 0 ? strip : null}
      {adding && <AddDialog kind={kind} pageKey={pageKey} name={name} what={what} onClose={() => setAdding(false)} onDone={() => { setAdding(false); setAt(0); router.refresh(); }} />}
    </>
  );
}

/** The dialog that adds one (board PicAdd): choose a file, say it is yours, send. */
function AddDialog({ kind, pageKey, name, what, onClose, onDone }: { kind: ShotKind; pageKey: string; name: string; what: string; onClose: () => void; onDone: () => void }) {
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
