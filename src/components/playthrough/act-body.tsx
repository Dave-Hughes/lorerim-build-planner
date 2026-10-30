"use client";

import Link from "next/link";
import { useState } from "react";
import { PreviewLink } from "@/components/pages/preview-link";
import type { Bit, StepData, StopData } from "@/lib/playthroughs/act-page";
import type { MapEntry } from "@/lib/places/map";
import { ActMap } from "./act-map";
import { Answer, TickBox } from "./play-controls";
import s from "./character-play.module.css";

/**
 * An act's steps beside its map (WO-181 Part 2). The steps are the line page's run: a numbered teal disc per route stop, shared by the steps at
 * that stop, the objective's words with the names in them linked, a chip for a follower or a quest line, and the why line under it. Hovering a step
 * lights its pin and hovering a pin lights its steps. Ticks and done marks come back only with progress tracking.
 */
export function Words({ bits }: { bits: Bit[] }) {
  return (
    <>
      {bits.map((b, i) =>
        b.href ? (
          <PreviewLink key={i} href={b.href} className={b.kind === "place" ? s.pl : s.pe}>
            {b.text}
          </PreviewLink>
        ) : (
          <span key={i}>{b.text}</span>
        ),
      )}
    </>
  );
}

export function ActBody({
  entry,
  steps,
  stops,
  notOnMap,
  mapHref,
  runId,
  owner,
  tracking,
  label,
}: {
  entry: MapEntry | null;
  steps: StepData[];
  stops: StopData[];
  notOnMap: string[];
  mapHref: string | null;
  runId: string;
  owner: boolean;
  tracking: boolean;
  label: string;
}) {
  const [hot, setHot] = useState(0);
  const placed = stops.some((x) => x.slug);
  const map = !!entry && placed;
  return (
    <div className={`${s.runGrid} ${map ? "" : s.runWide}`}>
      <div className={s.run}>
        {steps.map((o) => (
          <div key={o.id} id={`o${o.id}`} className={`${s.ob} ${o.no && hot === o.no ? s.obHot : ""} ${tracking && o.done ? s.obDone : ""}`} onMouseEnter={() => setHot(o.no ?? 0)} onMouseLeave={() => setHot(0)}>
            <span className={`${s.no} ${o.no ? "" : s.noOff}`} aria-hidden={o.no ? undefined : "true"}>
              {o.no ?? ""}
            </span>
            <span className={s.t}>
              <Words bits={o.bits} />
              {o.chip && <span className={`${s.chip} ${o.chip === "Follower" ? s.chipF : ""}`}>{o.chip}</span>}
            </span>
            {tracking && owner && !o.suggested && !o.fromSave ? <TickBox id={runId} objectiveId={o.id} done={o.done} label={o.bits.map((b) => b.text).join("")} /> : tracking && o.done ? <span className={s.doneMark} aria-label="Done">✓</span> : <span />}
            {o.why.length > 0 && (
              <span className={s.why}>
                <Words bits={o.why} />
              </span>
            )}
            {o.suggested && owner && (
              <span className={s.suggest}>
                <Answer id={runId} objectiveId={o.id} />
              </span>
            )}
          </div>
        ))}
        {steps.length === 0 && <p className={s.note}>No objectives in this act yet.</p>}
      </div>
      {map && (
        <div className={s.mapCol}>
          <ActMap entry={entry} stops={stops} hot={hot} onHot={setHot} mapHref={mapHref} notOnMap={notOnMap} label={label} />
          <span className={s.note}>Hover a stop or a step and the other lights up. Drag and zoom as on the Map page; each pin opens its place&apos;s card.</span>
        </div>
      )}
      {!map && notOnMap.length > 0 && (
        <p className={s.note}>
          Not on the map yet: {notOnMap.join(", ")}. {mapHref ? <Link href={mapHref}>Open on the map ›</Link> : null}
        </p>
      )}
    </div>
  );
}
