"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BUTTON_STEP, wheelFactor } from "@/lib/map/zoom";
import { PreviewLink } from "@/components/pages/preview-link";
import type { MapEntry, Pin } from "@/lib/places/map";
import s from "./map-view.module.css";

/**
 * LoreRim's paper map (WO-167), two ways: a band cut around one place (tiles at full size, dragged sideways), and the whole map with every
 * pin (pinched, wheeled or buttoned to zoom). Every instance carries the credit and link its author asked for, in the map's corner, in the
 * same dark plate as the names: this component cannot draw a map without it. Every name is on a plate, never bare on the parchment.
 */
const KIND_WORDS = { town: "Town", danger: "Dangerous place", other: "Other" } as const;

export interface MapViewProps {
  entry: MapEntry;
  pins: Pin[];
  here?: Pin;
  hereLabel?: string;
  labelled?: number;
  mode: "band" | "whole";
  className?: string;
  /** What the full screen map's bar says (WO-184 Part 7, board MapFull): the page's name and its hold, and where the Map page opens on it. A map with a title has a Full screen button. */
  title?: string;
  sub?: string;
  mapHref?: string;
  /** In a frame that is already 16:9 (WO-184 Part 8): fills it, and the compass moves below the frame's own buttons. */
  framed?: boolean;
}

/**
 * Every map on a page gets Full screen (WO-184 Part 7): the same pins and labels over the whole window, with a bar (the name, the key, Open on the Map page, Close; Esc closes too),
 * zoom, drag and the credit. The full screen map is the whole picture, zoomed in on the place when there is one.
 */
export function MapView(props: MapViewProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MapCore {...props} onFull={props.title ? () => setOpen(true) : undefined} />
      {open && props.title && typeof document !== "undefined" && createPortal(<FullScreen {...props} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function FullScreen({ title, sub, mapHref, onClose, ...rest }: MapViewProps & { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    const was = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = was;
    };
  }, [onClose]);
  return (
    <div className={s.full} role="dialog" aria-modal="true" aria-label={`${title}, full screen map`}>
      <div className={s.fullBar}>
        <span className={s.fullTitle}>{title}</span>
        {sub && <span className={s.fullSub}>{sub}</span>}
        <span className={s.fullKey}>
          <span className={s.town}>
            <i aria-hidden="true" />
            Town
          </span>
          <span className={s.danger}>
            <i aria-hidden="true" />
            Dangerous place
          </span>
        </span>
        {mapHref && (
          <a className={s.fullOpen} href={mapHref}>
            Open on the Map page ›
          </a>
        )}
        <button ref={close} type="button" className={s.fullClose} aria-label="Close the full screen map" onClick={onClose}>
          <span aria-hidden="true">✕ </span>Close
        </button>
      </div>
      <MapCore {...rest} mode="whole" labelled={rest.here ? 14 : 0} overlay framed={false} className={s.fullMap} />
    </div>
  );
}

function MapCore({ entry, pins, here, hereLabel, labelled = 0, mode, className, onFull, overlay, framed }: MapViewProps & { onFull?: () => void; overlay?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: mode === "band" ? 1440 : 1000, h: mode === "band" ? 400 : 707 });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // On a phone the band uses the half-size tiles (zoom 0), so the nearest town is in view beside the place (WO-167 review).
  // The frame's + and − step between the two tile sizes the map has (WO-184 Part 9); otherwise a phone-wide band uses the half-size ones.
  const [level, setLevel] = useState<0.5 | 1 | null>(null);
  const bandK = mode === "band" ? (level ?? (size.w < 700 ? 0.5 : 1)) : 1;
  const [x0, y0, x1, y1] = entry.border;
  const kWhole = entry.image.width / (x1 - x0);
  // `zoom`: css pixels for each pixel of the 8192 texture (band: 1) or of the whole picture (whole map).
  const fit = size.w / entry.image.width;
  const [zoom, setZoom] = useState(mode === "band" ? 1 : 0);
  // The full screen map opens at the zoom the page's own map has (WO-184 Part 9: half-size tiles in the frame), centred on its place; every other whole map opens at the whole picture.
  const opening = overlay && here ? 0.5 / kWhole : fit;
  const z = mode === "band" ? 1 : Math.max(fit, zoom || opening);
  // The view: where the picture's origin sits in the box.
  const toPix = useCallback((px: number, py: number) => (mode === "band" ? { x: px * bandK, y: py * bandK } : { x: (px - x0) * kWhole * z, y: (py - y0) * kWhole * z }), [mode, bandK, kWhole, z, x0, y0]);
  const centre = here ?? null;
  const [pan, setPan] = useState<{ x: number; y: number } | null>(null);
  const view = useMemo(() => {
    if (pan) return pan;
    if (mode === "band" && centre) return { x: size.w / 2 - centre.px * bandK, y: size.h / 2 - centre.py * bandK };
    if (mode === "whole" && overlay && centre) return { x: size.w / 2 - (centre.px - x0) * kWhole * z, y: size.h / 2 - (centre.py - y0) * kWhole * z };
    return { x: 0, y: 0 };
  }, [pan, mode, overlay, centre, bandK, size.w, size.h, kWhole, z, x0, y0]);
  const total = mode === "band" ? { w: entry.texture.width * bandK, h: entry.texture.height * bandK } : { w: entry.image.width * z, h: entry.image.height * z };
  const clamp = useCallback(
    (v: { x: number; y: number }) => {
      if (mode === "band") {
        // The window stays on the picture (WO-178): a place near the edge sits off-centre, never with a black strip beside the map.
        const minX = Math.min(0, size.w - x1 * bandK);
        const maxX = -x0 * bandK;
        const minY = Math.min(0, size.h - y1 * bandK);
        const maxY = -y0 * bandK;
        return { x: Math.min(maxX, Math.max(minX, v.x)), y: Math.min(maxY, Math.max(minY, v.y)) };
      }
      return { x: Math.min(0, Math.max(size.w - total.w, v.x)), y: Math.min(0, Math.max(size.h - total.h, v.y)) };
    },
    [mode, bandK, size.w, size.h, total.w, total.h, x0, x1, y0, y1],
  );
  const at = clamp(view);

  // Drag to pan; two fingers to zoom (the whole map). A drag that moved is not a click on a pin.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ start: { x: number; y: number }; origin: { x: number; y: number }; dist: number; zoom: number; moved: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    // An earlier drag's mark goes with the next press, wherever it lands, so a pin clicked after a pan still opens (WO-185 Part 2).
    gesture.current = null;
    if ((e.target as HTMLElement).closest("a, button")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const pts = [...pointers.current.values()];
    gesture.current = { start: pts[0], origin: at, dist: pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0, zoom: z, moved: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length > 1 && mode === "whole" && g.dist) {
      const next = Math.min(fit * 6, Math.max(fit, g.zoom * (Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) / g.dist)));
      zoomTo(next, { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 });
      return;
    }
    const dx = e.clientX - g.start.x;
    const dy = e.clientY - g.start.y;
    g.moved = Math.max(g.moved, Math.hypot(dx, dy));
    setPan({ x: g.origin.x + dx, y: mode === "band" ? g.origin.y + dy : g.origin.y + dy });
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (!pointers.current.size) gesture.current = gesture.current && gesture.current.moved > 5 ? { ...gesture.current, start: { x: 0, y: 0 } } : null;
  };
  const zoomTo = useCallback(
    (next: number, around: { x: number; y: number } | null) => {
      const rect = box.current?.getBoundingClientRect();
      const cx = around && rect ? around.x - rect.left : size.w / 2;
      const cy = around && rect ? around.y - rect.top : size.h / 2;
      const k = next / z;
      setZoom(next);
      setPan(clamp({ x: cx - (cx - at.x) * k, y: cy - (cy - at.y) * k }));
    },
    [z, size.w, size.h, at.x, at.y, clamp],
  );
  useEffect(() => {
    const el = box.current;
    if (!el || mode !== "whole") return;
    // A plain wheel scrolls the page (WO-177: the map is the page's width, and the wheel would trap the pointer); a trackpad pinch arrives as Ctrl and a wheel.
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !overlay) return;
      e.preventDefault();
      zoomTo(Math.min(fit * 6, Math.max(fit, z * wheelFactor(e))), { x: e.clientX, y: e.clientY });
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [mode, overlay, z, fit, zoomTo]);

  // The tiles in view: full size on a wide band, half size (zoom 0) on a phone; only the ones the box can see, and only those the map has.
  const tiles = useMemo(() => {
    if (mode !== "band") return [];
    const zoomTiles = entry.tiles.zooms.find((t) => t.z === (bandK < 1 ? 0 : 1));
    if (!zoomTiles) return [];
    // One tile spans this many pixels of the 8192 texture, and this many css pixels on the stage.
    const span = (entry.tiles.size * entry.texture.width) / zoomTiles.size;
    const T = span * bandK;
    const left = Math.floor((-at.x - T) / T);
    const right = Math.floor((-at.x + size.w + T) / T);
    const top = Math.floor((-at.y - T) / T);
    const bottom = Math.floor((-at.y + size.h + T) / T);
    const out: { x: number; y: number; src: string; css: number }[] = [];
    for (let ty = Math.max(top, zoomTiles.rows[0]); ty <= Math.min(bottom, zoomTiles.rows[1]); ty++)
      for (let tx = Math.max(left, zoomTiles.columns[0]); tx <= Math.min(right, zoomTiles.columns[1]); tx++) out.push({ x: tx, y: ty, css: T, src: entry.tiles.url.replace("{z}", String(zoomTiles.z)).replace("{x}", String(tx)).replace("{y}", String(ty)) });
    return out;
  }, [mode, bandK, entry.tiles, entry.texture.width, at.x, at.y, size.w, size.h]);

  // The pins in view.
  const visible = pins
    .map((p, i) => ({ p, i, ...toPix(p.px, p.py) }))
    .filter((p) => p.x + at.x > -40 && p.x + at.x < size.w + 40 && p.y + at.y > -40 && p.y + at.y < size.h + 40);
  const hereAt = here ? toPix(here.px, here.py) : null;
  // 1 km is about 70,000 game units: 1,094 pixels of the texture.
  const kmPx = (70000 / entry.texture.unitsPerPixel) * (mode === "band" ? bandK : kWhole * z);
  // What the corner controls cover, in the box's own pixels: a name never sits under one (WO-167 review).
  const phoneBox = size.w < 700;
  const controls: [number, number, number, number][] = [
    [0, 0, 56, 60],
    [0, size.h - 44, Math.min(kmPx, 220) + 96, size.h],
    ...(phoneBox ? [] : [[0, size.h - 82, 270, size.h - 40] as [number, number, number, number]]),
    [size.w - (phoneBox ? Math.min(size.w - 130, 230) : 250), size.h - 44, size.w, size.h],
    ...(mode === "whole" ? [[size.w - 56, 0, size.w, 90] as [number, number, number, number]] : []),
  ];
  const underControl = (x0_: number, x1_: number, y: number) => controls.some(([a, b, c, d]) => x1_ > a && x0_ < c && y + 13 > b && y - 13 < d);
  // The bar is as long as 1 km, or the part of a km that fits beside the credit.
  const cap = Math.min(220, size.w * 0.26);
  // Which side of its pin each name goes on, and never over another name (WO-184 Part 9: the full screen map's labels overlapped): the place itself is named first, then the nearest pins.
  const sides = new Map<number, "right" | "left" | "none">();
  {
    type B = [number, number, number, number];
    const taken: B[] = [];
    const hit = (b: B) => taken.some((t) => b[0] < t[2] && b[2] > t[0] && b[1] < t[3] && b[3] > t[1]);
    if (hereAt) {
      const w = (hereLabel ?? here!.name).length * 7.4 + 22;
      taken.push([hereAt.x + at.x + 8, hereAt.y + at.y - 13, hereAt.x + at.x + 14 + w, hereAt.y + at.y + 13]);
    }
    for (const { p, i, x, y } of visible) {
      if (i >= labelled) continue;
      const w = p.name.length * 7.4 + 22;
      const sx = x + at.x;
      const sy = y + at.y;
      if (sy < 16 || sy > size.h - 16) continue;
      const right: B = [sx + 8, sy - 13, sx + 14 + w, sy + 13];
      const left: B = [sx - 14 - w, sy - 13, sx - 8, sy + 13];
      const okRight = right[2] <= size.w - 6 && !underControl(right[0], right[2], sy) && !hit(right);
      const okLeft = left[0] >= 6 && !underControl(left[0], left[2], sy) && !hit(left);
      const side = okRight ? "right" : okLeft ? "left" : "none";
      if (side !== "none") {
        sides.set(i, side);
        taken.push(side === "right" ? right : left);
      }
    }
  }

  return (
    <div
      ref={box}
      className={`${s.map} ${mode === "band" ? s.band : s.whole} ${overlay ? s.noLegend : ""} ${framed ? s.framed : ""} ${className ?? ""}`}
      role="group"
      aria-label={overlay ? "Map, full screen" : mode === "band" ? "Map around this place" : "Map of Skyrim"}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onClickCapture={(e) => {
        if (gesture.current && gesture.current.moved > 5) e.preventDefault();
      }}
    >
      <div className={s.stage} style={{ transform: `translate(${at.x}px, ${at.y}px)`, width: total.w, height: total.h }}>
        {mode === "band" ? (
          tiles.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${t.x}_${t.y}`} src={t.src} alt="" width={t.css} height={t.css} draggable={false} className={s.tile} style={{ left: t.x * t.css, top: t.y * t.css, width: t.css + 0.5, height: t.css + 0.5 }} />
          ))
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.image.url} alt="" width={entry.image.width * z} height={entry.image.height * z} draggable={false} className={s.whole_img} />
        )}
        {visible.map(({ p, i, x, y }) => {
          const side = sides.get(i) ?? "none";
          return (
            <div key={`${p.name}-${i}`} className={s.pinBox} style={{ left: x, top: y }}>
              <PreviewLink href={p.href} className={`${s.pin} ${s[p.kind]} ${side === "left" ? s.flip : ""}`}>
                <i aria-hidden="true" />
                {side === "none" ? <span className={s.sr}>{p.name}</span> : <span className={s.plate}>{p.name}</span>}
              </PreviewLink>
            </div>
          );
        })}
        {here && hereAt && (
          <div className={s.pinBox} style={{ left: hereAt.x, top: hereAt.y }}>
            <span className={`${s.pin} ${s.here}`}>
              <i aria-hidden="true" />
              <span className={s.plate}>{hereLabel ?? here.name}</span>
            </span>
          </div>
        )}
      </div>

      <span className={`${s.plate} ${s.compass}`} aria-label="North is up">
        <b aria-hidden="true">N</b>
        <i aria-hidden="true" />
      </span>
      <span className={`${s.plate} ${s.scale}`}>
        <i style={{ width: Math.max(24, Math.min(kmPx, cap)) }} aria-hidden="true" />
        {kmPx > cap ? `${Math.round((cap / kmPx) * 10) / 10} km` : kmPx < 24 ? `${Math.round((24 / kmPx) * 10) / 10} km` : "1 km"}
      </span>
      <span className={`${s.plate} ${s.legend}`} aria-label="Pin colours">
        {(["town", "danger", "other"] as const).map((k) => (
          <span key={k} className={s[k]}>
            <i aria-hidden="true" />
            {KIND_WORDS[k]}
          </span>
        ))}
      </span>
      {onFull && (
        <button type="button" className={`${s.plate} ${s.fullBtn}`} aria-label="Open the map full screen" onClick={onFull}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
          </svg>
          Full screen
        </button>
      )}
      {mode === "band" && framed && (
        <span className={`${s.zoomBtns} ${s.zoomLow}`}>
          <button
            type="button"
            className={s.plate}
            aria-label="Zoom in"
            onClick={() => {
              setLevel(1);
              setPan(null);
            }}
          >
            +
          </button>
          <button
            type="button"
            className={s.plate}
            aria-label="Zoom out"
            onClick={() => {
              setLevel(0.5);
              setPan(null);
            }}
          >
            −
          </button>
        </span>
      )}
      {mode === "whole" && (
        <span className={`${s.zoomBtns} ${onFull ? s.zoomLow : ""}`}>
          <button type="button" className={s.plate} aria-label="Zoom in" onClick={() => zoomTo(Math.min(fit * 6, z * BUTTON_STEP), null)}>
            +
          </button>
          <button type="button" className={s.plate} aria-label="Zoom out" onClick={() => zoomTo(Math.max(fit, z / BUTTON_STEP), null)}>
            −
          </button>
        </span>
      )}
      {/* The credit its author asked for, on every instance of the map. */}
      <a className={`${s.plate} ${s.credit}`} href={entry.credit.url} target="_blank" rel="noreferrer">
        Map: {entry.credit.text} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
