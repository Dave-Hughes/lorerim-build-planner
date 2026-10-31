"use client";

/* eslint-disable @next/next/no-img-element -- the screenshots are shown as sent, at their own sizes. */
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { approveScreenshot, deleteScreenshot, leadScreenshot, removeScreenshot } from "@/lib/screenshots/actions";
import type { ShotData } from "@/lib/screenshots/view";
import { checkWords, noShotYet, shotCaption, type ShotKind } from "@/lib/screenshots/words";
import { AddDialog } from "./add-dialog";
import s from "./frame.module.css";

const THUMBS = 6;

/**
 * The frame at the top of a place's or a person's page (WO-184 Part 8, board PlaceOptB): one 16:9 frame that is a screenshot or the map, with Screenshot and Map at its top left
 * and Full screen at its top right, and a row of thumbnails under it (the lead one marked, a "+" tile to add one, and how many there are). It opens on the lead screenshot,
 * or on the map when there is none. A reader's own screenshot under review is a thumbnail with its flag, never what the frame opens on. An admin's Approve, Make it lead,
 * Remove and Delete show under it for the screenshot in the frame.
 */
export function Frame({ kind, pageKey, name, data, map, signInPlus, signInText, signInOne }: { kind: ShotKind; pageKey: string; name: string; data: { shots: ShotData[]; signedIn: boolean; admin: boolean }; map: ReactNode | null; signInPlus: ReactNode; signInText: ReactNode; signInOne: ReactNode }) {
  const router = useRouter();
  const { shots, signedIn, admin } = data;
  const firstLive = shots.findIndex((x) => x.status === "live");
  const [view, setView] = useState<"shot" | "map">(firstLive >= 0 || !map ? "shot" : "map");
  const [at, setAt] = useState(firstLive);
  const [adding, setAdding] = useState(false);
  const [whole, setWhole] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  // A screenshot just sent: the file the player chose shows in the strip and the frame at once, and a live one is selected as soon as the page has it.
  const [sent, setSent] = useState<{ id: number; preview: string; select: boolean } | null>(null);
  const srcOf = (x: ShotData, own: string) => (sent && sent.id === x.id ? sent.preview : own);
  const arrived = sent?.select ? shots.findIndex((x) => x.id === sent.id) : -1;
  if (sent && arrived >= 0) {
    setAt(arrived);
    setView("shot");
    setSent({ ...sent, select: false });
  }
  const cur = at >= 0 ? shots[at] : undefined;
  const live = shots.filter((x) => x.status === "live").length;
  const waiting = shots.length - live;
  const what = kind === "place" ? "place" : "person";

  const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) return setError(r.error);
      setError("");
      setConfirming(false);
      router.refresh();
    });

  // Screenshots page through full screen with the arrow keys; Esc closes.
  useEffect(() => {
    if (whole === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWhole(null);
      else if (e.key === "ArrowRight") setWhole((w) => (w === null ? w : (w + 1) % shots.length));
      else if (e.key === "ArrowLeft") setWhole((w) => (w === null ? w : (w - 1 + shots.length) % shots.length));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [whole, shots.length]);

  const count = live ? `${live} ${live === 1 ? "screenshot" : "screenshots"}${admin && waiting ? `, ${waiting} waiting` : ""}.` : "No screenshots yet.";
  return (
    <div className={s.wrap}>
      <div className={s.frame} data-view={view}>
        {view === "map" && map ? (
          map
        ) : cur ? (
          <>
            <img className={s.fi} src={srcOf(cur, cur.url)} alt={`${name}, a screenshot by ${cur.byName ?? "a player"}`} />
            <span className={s.credit}>
              {cur.byImage ? <img className={s.av} src={cur.byImage} alt="" /> : <span className={s.av} />}
              {cur.mine && cur.status === "review" ? "Your screenshot" : shotCaption(cur.byName)}
            </span>
            {cur.status === "review" && <span className={s.flag}>{cur.reported ? "Reported" : "Under review"}</span>}
          </>
        ) : (
          <div className={s.empty}>
            <span>{noShotYet(name)}</span>
            {signedIn ? (
              <button type="button" className="btn btn-sm" onClick={() => setAdding(true)}>
                + Add a screenshot
              </button>
            ) : (
              signInOne
            )}
          </div>
        )}
        {map && (
          <div className={s.fl} role="group" aria-label="What the frame shows">
            <button type="button" className={`${s.vt} ${view === "shot" ? s.on : ""}`} aria-pressed={view === "shot"} onClick={() => setView("shot")}>
              Screenshot
            </button>
            <button type="button" className={`${s.vt} ${view === "map" ? s.on : ""}`} aria-pressed={view === "map"} onClick={() => setView("map")}>
              Map
            </button>
          </div>
        )}
        {view === "shot" && cur && (
          <button type="button" className={`${s.fr} ${s.mt}`} aria-label="Open the screenshot full screen" onClick={() => setWhole(at)}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
            </svg>
            Full screen
          </button>
        )}
      </div>

      <div className={s.thumbs}>
        {shots.slice(0, THUMBS).map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={`${s.tb} ${view === "shot" && i === at ? s.tbOn : ""}`}
            aria-label={`Screenshot ${i + 1}, ${x.status === "review" ? "under review" : `by ${x.byName ?? "a player"}`}${i === firstLive && x.status === "live" ? ", leads the page" : ""}`}
            aria-pressed={view === "shot" && i === at}
            onClick={() => {
              setAt(i);
              setView("shot");
            }}
          >
            <img src={srcOf(x, x.thumbUrl)} alt="" />
            {x.status === "review" && <span className={s.flagSm}>Review</span>}
            {i === firstLive && x.status === "live" && shots.filter((y) => y.status === "live").length > 1 && <span className={s.leadMark}>Lead</span>}
          </button>
        ))}
        {shots.length > THUMBS && (
          <button type="button" className={s.more} aria-label={`${shots.length - THUMBS} more screenshots, open them all full screen`} onClick={() => setWhole(THUMBS)}>
            +{shots.length - THUMBS} more
          </button>
        )}
        {signedIn ? (
          <button type="button" className={s.tadd} aria-label={`Add a screenshot of ${name}`} onClick={() => setAdding(true)}>
            +
          </button>
        ) : (
          signInPlus
        )}
        <span className={s.count}>
          {count}{" "}
          {signedIn ? (
            <button type="button" className={s.link} onClick={() => setAdding(true)}>
              Add yours
            </button>
          ) : live ? (
            signInText
          ) : null}
        </span>
      </div>

      {admin && view === "shot" && cur && (
        <div className={s.tools} role="group" aria-label="Admin: this screenshot">
          <span className={s.who}>
            {cur.byName ?? "A player"}, <LocalDate date={cur.at} short />
            {cur.status === "review" ? `. ${checkWords(cur.check)}.` : ""}
          </span>
          {cur.status === "review" && (
            <button type="button" className={s.tool} disabled={pending} onClick={() => run(() => approveScreenshot(cur.id))}>
              Approve
            </button>
          )}
          {at !== firstLive && (
            <button type="button" className={s.tool} disabled={pending} onClick={() => run(() => leadScreenshot(cur.id))}>
              Make it lead
            </button>
          )}
          {cur.status === "review" ? (
            <button type="button" className={`${s.tool} ${s.red}`} disabled={pending} onClick={() => run(() => removeScreenshot(cur.id))}>
              Remove
            </button>
          ) : (
            <button type="button" className={`${s.tool} ${s.red}`} disabled={pending} onClick={() => setConfirming(true)}>
              Delete
            </button>
          )}
          {confirming && (
            <div className={s.pop} role="alertdialog" aria-label="Delete this screenshot?">
              <strong>Delete this screenshot?</strong>
              <span className={s.note}>It goes from the page for everyone.{at === firstLive && live > 1 ? " The next one leads." : ""}</span>
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
        </div>
      )}
      {cur?.mine && cur.status === "review" && !admin && (
        <p className={s.only}>
          Only you can see this until an admin approves it.{" "}
          <button type="button" className={s.link} disabled={pending} onClick={() => run(() => removeScreenshot(cur.id))}>
            Remove it
          </button>
        </p>
      )}
      {error && (
        <p role="alert" className={s.err}>
          {error}
        </p>
      )}

      {whole !== null && shots[whole] && (
        <div className={s.dim} onClick={() => setWhole(null)}>
          <div className={s.full} role="dialog" aria-modal="true" aria-label={`${name}, screenshots full screen`} onClick={(e) => e.stopPropagation()}>
            <img src={shots[whole].url} alt={`${name}, a screenshot by ${shots[whole].byName ?? "a player"}`} />
            <div className={s.fullBar}>
              <span>
                {shotCaption(shots[whole].byName)}, {whole + 1} of {shots.length}
              </span>
              {shots.length > 1 && (
                <>
                  <button type="button" className="btn btn-sm" onClick={() => setWhole((whole - 1 + shots.length) % shots.length)}>
                    ‹ Previous
                  </button>
                  <button type="button" className="btn btn-sm" onClick={() => setWhole((whole + 1) % shots.length)}>
                    Next ›
                  </button>
                </>
              )}
              <button type="button" className="btn btn-sm" onClick={() => setWhole(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {adding && (
        <AddDialog
          kind={kind}
          pageKey={pageKey}
          name={name}
          what={what}
          admin={admin}
          onClose={() => setAdding(false)}
          onDone={(done) => {
            setAdding(false);
            setSent({ id: done.id, preview: done.preview, select: done.status === "live" });
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
