"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PreviewLink } from "@/components/pages/preview-link";
import type { StopData } from "@/lib/playthroughs/act-page";
import type { MapEntry } from "@/lib/places/map";
import s from "./act-map.module.css";

/**
 * An act's own map (WO-181 Part 2): the paper map cut to its stops, a numbered pin for each, the road between them in order (orange dashed on foot,
 * gold dotted by carriage), the key, zoom, drag, and the credit its author asked for. Hovering a pin lights its steps, and the steps light the pin.
 * `still` draws only the picture and the road, with no pins or controls: the Begin Act I panel's backdrop.
 */
const K_MAX = 1.6;
const MIN_SPAN = 700;

export function ActMap({
  entry,
  stops,
  hot = 0,
  onHot,
  still = false,
  mapHref,
  notOnMap = [],
  label,
}: {
  entry: MapEntry;
  stops: StopData[];
  hot?: number;
  onHot?: (n: number) => void;
  still?: boolean;
  mapHref?: string | null;
  notOnMap?: string[];
  label: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 520, h: 600 });
  const [measured, setMeasured] = useState(false);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
      setMeasured(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const placed = useMemo(() => stops.filter((x): x is StopData & { px: number; py: number } => x.px !== null && x.py !== null), [stops]);
  const [x0, y0, x1, y1] = entry.border;
  const kMin = Math.min(size.w / (x1 - x0), size.h / (y1 - y0)) * 0.9;
  // The crop that holds every stop with a margin round them (never closer than the first zoom, so one stop isn't a blur): as tall as the stops
  // need, up to the box's own height, so no empty band of the box shows above or below the paper.
  const crop = useMemo(() => {
    const xs = placed.map((p) => p.px);
    const ys = placed.map((p) => p.py);
    if (!xs.length) return null;
    const dx = Math.max(Math.max(...xs) - Math.min(...xs), MIN_SPAN);
    const dy = Math.max(Math.max(...ys) - Math.min(...ys), MIN_SPAN);
    return { dx, dy, cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2 };
  }, [placed]);
  const maxH = size.w < 700 ? 320 : 600;
  // Room round the stops for the key and Open on the map above, the credit below, and the names beside the pins.
  const padX = 70;
  const padTop = 56;
  const padBottom = 52;
  const kW = crop ? Math.min(K_MAX, Math.max(kMin, (size.w - 2 * padX) / crop.dx)) : kMin;
  const wantH = crop ? Math.round(Math.min(maxH, Math.max(size.w < 700 ? 300 : 380, crop.dy * kW + padTop + padBottom))) : maxH;
  const boxH = still ? size.h : wantH;
  const fit = useMemo(() => {
    if (!crop) return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, k: kMin };
    const k = Math.min(K_MAX, Math.max(kMin, Math.min((size.w - 2 * padX) / crop.dx, (boxH - padTop - padBottom) / crop.dy)));
    // The stops sit between the key and the credit, not in the middle of the box.
    return { cx: crop.cx, cy: crop.cy - (padTop - padBottom) / 2 / k, k };
  }, [crop, size.w, boxH, kMin, x0, x1, y0, y1]);
  const [moved, setMoved] = useState<{ cx: number; cy: number; k: number } | null>(null);
  const raw = moved ?? fit;
  const k = Math.min(K_MAX, Math.max(kMin, raw.k));
  // The paper's edge stays outside the box when the box is smaller than the paper (the margins of the texture and its frame never show).
  const keep = (c: number, lo: number, hi: number, half: number) => (hi - lo <= 2 * half ? (lo + hi) / 2 : Math.min(hi - half, Math.max(lo + half, c)));
  const view = { cx: keep(raw.cx, x0, x1, size.w / 2 / k), cy: keep(raw.cy, y0, y1, boxH / 2 / k), k };
  const toScreen = useCallback((px: number, py: number) => ({ x: (px - view.cx) * k + size.w / 2, y: (py - view.cy) * k + boxH / 2 }), [view.cx, view.cy, k, size.w, boxH]);

  // Drag to pan. A drag that moved is not a click on a pin.
  const gesture = useRef<{ x: number; y: number; cx: number; cy: number; moved: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (still || (e.target as HTMLElement).closest("a, button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, moved: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    g.moved = Math.max(g.moved, Math.hypot(dx, dy));
    setMoved({ k, cx: g.cx - dx / k, cy: g.cy - dy / k });
  };
  const onUp = () => {
    gesture.current = gesture.current && gesture.current.moved > 5 ? { ...gesture.current, x: 0, y: 0 } : null;
  };
  const zoom = (f: number) => setMoved({ cx: view.cx, cy: view.cy, k: Math.min(K_MAX, Math.max(kMin, k * f)) });

  // The tiles in view: the half-size ones from afar, the full-size ones close in; the whole picture is under them while they load.
  const tileZoom = k < 0.5 ? 0 : 1;
  const tiles = useMemo(() => {
    const z = entry.tiles.zooms.find((t) => t.z === tileZoom);
    if (!z || !measured) return [];
    const span = (entry.tiles.size * entry.texture.width) / z.size;
    const l = Math.floor((view.cx - size.w / 2 / k) / span);
    const r = Math.floor((view.cx + size.w / 2 / k) / span);
    const t = Math.floor((view.cy - boxH / 2 / k) / span);
    const b = Math.floor((view.cy + boxH / 2 / k) / span);
    const out: { x: number; y: number; src: string; left: number; top: number; px: number }[] = [];
    for (let ty = Math.max(t, z.rows[0]); ty <= Math.min(b, z.rows[1]); ty++)
      for (let tx = Math.max(l, z.columns[0]); tx <= Math.min(r, z.columns[1]); tx++) {
        const sc = toScreen(tx * span, ty * span);
        out.push({ x: tx, y: ty, src: entry.tiles.url.replace("{z}", String(tileZoom)).replace("{x}", String(tx)).replace("{y}", String(ty)), left: sc.x, top: sc.y, px: span * k });
      }
    return out;
  }, [entry, tileZoom, view.cx, view.cy, k, size.w, boxH, toScreen, measured]);
  const whole = toScreen(x0, y0);

  // The road, leg by leg: how she gets to a stop is that stop's `by`.
  const legs = placed.slice(1).map((p, i) => ({ from: toScreen(placed[i].px, placed[i].py), to: toScreen(p.px, p.py), by: p.by }));
  const carriage = placed.some((p, i) => i > 0 && p.by === "carriage");
  const plateWidth = (name: string) => name.length * 6.5 + 15;

  return (
    <div className={`${s.wrap} ${still ? s.still : ""}`}>
      <div ref={box} className={s.map} style={still ? undefined : ({ "--ah": `${boxH}px` } as React.CSSProperties)} role={still ? "presentation" : "group"} aria-label={still ? undefined : label} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClickCapture={(e) => { if (gesture.current && gesture.current.moved > 5) { e.preventDefault(); e.stopPropagation(); } }}>
        <div className={s.frame} style={{ left: whole.x, top: whole.y, width: (x1 - x0) * k, height: (y1 - y0) * k }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.image.url} alt="" draggable={false} className={s.base} style={{ left: 0, top: 0, width: (x1 - x0) * k, height: (y1 - y0) * k }} />
          {tiles.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${tileZoom}_${t.x}_${t.y}`} src={t.src} alt="" draggable={false} className={s.tile} style={{ left: t.left - whole.x, top: t.top - whole.y, width: t.px + 1, height: t.px + 1 }} />
          ))}
        </div>
        {legs.length > 0 && (
          <svg className={s.svg} width={size.w} height={boxH} aria-hidden="true">
            {legs.map((l, i) => (
              <g key={i}>
                <line x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke="#10161d" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
                <line x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke={l.by === "carriage" ? "#e8c987" : "#f0913f"} strokeWidth="3" strokeDasharray={l.by === "carriage" ? "2 7" : "9 7"} strokeLinecap="round" />
              </g>
            ))}
          </svg>
        )}
        {!still &&
          placed.map((p) => {
            const at = toScreen(p.px, p.py);
            const name = p.place;
            const left = at.x + 22 + plateWidth(name) > size.w - 10;
            const pin = (
              <>
                <i>{p.no}</i>
                <span className={`${s.plate} ${left ? s.plateLeft : ""}`}>
                  {name}
                  {p.steps > 1 && <small>{p.steps} steps here</small>}
                </span>
              </>
            );
            const cls = `${s.pin} ${hot === p.no ? s.hot : ""}`;
            return (
              <span key={p.no} className={cls} style={{ left: at.x, top: at.y }} onMouseEnter={() => onHot?.(p.no)} onMouseLeave={() => onHot?.(0)}>
                {p.href ? (
                  <PreviewLink href={p.href} className={s.pinLink}>
                    {pin}
                  </PreviewLink>
                ) : (
                  <span className={s.pinLink}>{pin}</span>
                )}
              </span>
            );
          })}
        {!still && (
          <>
            <div className={s.top}>
              <span className={s.key}>
                <span>
                  <b />
                  On foot
                </span>
                {carriage && (
                  <span>
                    <b className={s.dots} />
                    Carriage
                  </span>
                )}
              </span>
              {mapHref && (
                <Link href={mapHref} className={s.onMap}>
                  Open on the map ›
                </Link>
              )}
            </div>
            <span className={s.ctl}>
              <button type="button" aria-label="Zoom in" onClick={() => zoom(1.5)}>
                +
              </button>
              <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / 1.5)}>
                −
              </button>
            </span>
          </>
        )}
        {/* The credit its author asked for, on every instance of the map. */}
        <a className={s.credit} href={entry.credit.url} target="_blank" rel="noreferrer">
          Map: {entry.credit.text} <span aria-hidden="true">↗</span>
        </a>
      </div>
      {!still && notOnMap.length > 0 && <p className={s.missing}>Not on the map yet: {notOnMap.join(", ")}</p>}
    </div>
  );
}
