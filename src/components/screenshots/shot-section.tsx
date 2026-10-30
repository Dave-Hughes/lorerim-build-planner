"use client";

/* eslint-disable @next/next/no-img-element -- the screenshots are shown as sent, at their own sizes. */
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { approveScreenshot, deleteScreenshot, leadScreenshot, removeScreenshot } from "@/lib/screenshots/actions";
import type { ShotData } from "@/lib/screenshots/view";
import { checkWords, SHOT_BYTES, SHOT_WORDS, type ShotKind } from "@/lib/screenshots/words";
import s from "./shot-section.module.css";

/**
 * The Screenshots section of a place or a person (WO-184 Part 7, boards PicPlace, PicYours, PicAdmin and PicPerson): a grid of 16:9 tiles (letterboxed in black when a
 * screenshot isn't 16:9), each with who sent it and when, the lead one marked, and an Add tile last. A tile opens the screenshot whole. A screenshot of the reader's own
 * that is under review shows only here, flagged. An admin's Approve, Make it lead, Remove and Delete sit under each tile.
 */
export function ShotSection({ kind, pageKey, name, data, signInTile }: { kind: ShotKind; pageKey: string; name: string; data: { shots: ShotData[]; signedIn: boolean; admin: boolean }; signInTile: ReactNode }) {
  const router = useRouter();
  const { shots, signedIn, admin } = data;
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<ShotData | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const what = kind === "place" ? "place" : "person";
  const lead = shots.find((x) => x.status === "live");
  const waiting = shots.filter((x) => x.status === "review").length;
  const shown = shots.length - waiting;

  const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) return setError(r.error);
      setError("");
      setConfirming(null);
      router.refresh();
    });

  const count = admin ? (waiting ? `${shown} shown, ${waiting} waiting` : shown ? `${shown} so far` : "None yet") : shown + waiting ? `${shown + waiting} so far` : "None yet";
  return (
    <section id="shots" className={s.section} aria-labelledby="shots-h">
      <h2 id="shots-h" className={s.h2}>
        <img className={s.px} src="/icons/tab-play.svg" alt="" width={30} height={30} />
        Screenshots
        <small>{count}</small>
      </h2>
      <div className={s.gal}>
        {shots.map((x) => {
          const isLead = x.id === lead?.id;
          return (
            <figure key={x.id} className={`${s.gi} ${isLead ? s.lead : ""}`}>
              <div className={s.im}>
                <button type="button" className={s.open} aria-label={`Open the screenshot by ${x.byName ?? "a player"} whole`} onClick={() => setOpen(x)}>
                  <img src={x.thumbUrl} alt={`${name}, a screenshot by ${x.byName ?? "a player"}`} loading="lazy" />
                </button>
                {isLead && <span className={`${s.badge} ${s.badgeLead}`}>Leads the page</span>}
                {x.status === "review" && <span className={`${s.badge} ${s.badgeRev}`}>{x.reported ? "Reported" : "Under review"}</span>}
              </div>
              <figcaption className={s.meta}>
                {x.mine && x.status === "review" ? (
                  <span className={s.only}>
                    Only you can see this until an admin approves it.
                    <button type="button" className={s.link} disabled={pending} onClick={() => run(() => removeScreenshot(x.id))}>
                      Remove it
                    </button>
                  </span>
                ) : (
                  <>
                    {x.byImage ? <img className={s.av} src={x.byImage} alt="" /> : <span className={`${s.av} ${s.blank}`} />}
                    {x.byName ?? "A player"}
                    <span className={s.r}>{admin && x.status === "review" ? checkWords(x.check) : <LocalDate date={x.at} short />}</span>
                  </>
                )}
              </figcaption>
              {admin && (
                <div className={s.tools}>
                  {x.status === "review" && (
                    <button type="button" className={s.tool} disabled={pending} onClick={() => run(() => approveScreenshot(x.id))}>
                      Approve
                    </button>
                  )}
                  {!isLead && (
                    <button type="button" className={s.tool} disabled={pending} onClick={() => run(() => leadScreenshot(x.id))}>
                      Make it lead
                    </button>
                  )}
                  {x.status === "review" ? (
                    <button type="button" className={`${s.tool} ${s.red}`} disabled={pending} onClick={() => run(() => removeScreenshot(x.id))}>
                      Remove
                    </button>
                  ) : (
                    <button type="button" className={`${s.tool} ${s.red}`} disabled={pending} onClick={() => setConfirming(x.id)}>
                      Delete
                    </button>
                  )}
                </div>
              )}
              {confirming === x.id && (
                <div className={s.pop} role="alertdialog" aria-label="Delete this screenshot?">
                  <strong>Delete this screenshot?</strong>
                  <span className={s.note}>It goes from the page for everyone. {isLead && shots.filter((y) => y.status === "live").length > 1 ? "The next one leads." : ""}</span>
                  <span className={s.popBtns}>
                    <button type="button" className={`btn btn-sm ${s.redBtn}`} disabled={pending} onClick={() => run(() => deleteScreenshot(x.id))}>
                      Delete
                    </button>
                    <button type="button" className="btn btn-sm" onClick={() => setConfirming(null)}>
                      Keep it
                    </button>
                  </span>
                </div>
              )}
            </figure>
          );
        })}
        {signedIn ? (
          <button type="button" className={s.addt} onClick={() => setAdding(true)}>
            {shots.length ? "+ Add a screenshot" : `+ Add a screenshot of ${name}`}
            <small>{admin ? "Yours go live at once" : "Your own, from LoreRim"}</small>
          </button>
        ) : (
          signInTile
        )}
        {!shots.length && [1, 0.6, 0.3].map((o) => <div key={o} className={s.ghost} style={{ opacity: o }} aria-hidden="true" />)}
      </div>
      {error && (
        <p role="alert" className={s.err}>
          {error}
        </p>
      )}
      {open && (
        <div className={s.dim} onClick={() => setOpen(null)}>
          <div className={s.whole} role="dialog" aria-modal="true" aria-label="Screenshot" onClick={(e) => e.stopPropagation()}>
            <img src={open.url} alt={`${name}, a screenshot by ${open.byName ?? "a player"}`} />
            <button type="button" className="btn btn-sm" onClick={() => setOpen(null)}>
              Close
            </button>
          </div>
        </div>
      )}
      {adding && (
        <AddDialog
          kind={kind}
          pageKey={pageKey}
          name={name}
          what={what}
          onClose={() => setAdding(false)}
          onDone={() => {
            setAdding(false);
            router.refresh();
          }}
        />
      )}
    </section>
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
