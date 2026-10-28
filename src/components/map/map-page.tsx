"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PreviewLink } from "@/components/pages/preview-link";
import type { Drawer, MapCharacter, MapPlace, MapSearch } from "@/lib/map/data";
import { PLACE_GROUPS, groupOf } from "@/lib/places/groups";
import type { MapEntry } from "@/lib/places/map";
import s from "./map-page.module.css";

/**
 * The Map page (WO-169). The paper map fills the window; drag to pan, wheel or pinch to zoom. Pins cluster into counts at a distance and show
 * their names as you come in. The left panel searches places, people and quests and filters what shows (what is filtered out fades); a
 * place opens a drawer. The address keeps the view. The credit and link the map's author asked for are in the corner on every view.
 */
export interface MapInitial {
  place: string | null;
  quest: string | null;
  character: string | null;
  types: string[];
  danger: [number, number];
  onlyQuests: boolean;
  zoom: number | null;
  x: number | null;
  y: number | null;
}
interface View {
  cx: number;
  cy: number;
  k: number;
}
interface Route {
  name: string;
  href: string;
  stops: { slug: string; name: string; why: string | null }[];
}

const K_MAX = 1.6;
const KIND_COLOUR = { city: "city", town: "town", danger: "danger", other: "other" } as const;

export function MapPage({ entry, places, initial, signedIn }: { entry: MapEntry; places: MapPlace[]; initial: MapInitial; signedIn: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 800 });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [x0, y0, x1, y1] = entry.border;
  // A little further out than the window fits, so the whole map can sit beside the panel.
  const kMin = Math.min(size.w / (x1 - x0), size.h / (y1 - y0)) * 0.8;
  const bySlug = useMemo(() => new Map(places.map((p) => [p.slug, p])), [places]);

  // The view: the texture pixel at the middle of the window, and css pixels per texture pixel. Until you move it, it is worked out from the
  // window: the whole map fitted into the space beside the panel (and above a phone's bar), or the picked place in the part of the map you can see.
  const [panelOpen, setPanelOpen] = useState(true);
  const [moved, setView] = useState<View | null>(() => {
    if (initial.zoom === null && initial.x === null) return null;
    const at = initial.place ? places.find((p) => p.slug === initial.place) : null;
    return { cx: initial.x ?? at?.px ?? (x0 + x1) / 2, cy: initial.y ?? at?.py ?? (y0 + y1) / 2, k: initial.zoom ?? (at ? 0.9 : 0.16) };
  });
  const phone = size.w < 700;
  const beside = !phone && panelOpen ? 354 : 0;
  const view: View = (() => {
    if (moved) return moved;
    const at = initial.place ? places.find((p) => p.slug === initial.place) : null;
    if (at) {
      const kk = 0.9;
      // On a phone the drawer is a sheet over the lower part of the map: the place goes in the upper part.
      return { cx: at.px - (beside / 2) / kk, cy: at.py + (phone ? (size.h * 0.2) / kk : 0), k: kk };
    }
    const kk = Math.min((size.w - beside - 24) / (x1 - x0), (size.h - (phone ? 56 : 24)) / (y1 - y0));
    return { cx: (x0 + x1) / 2 - beside / 2 / kk, cy: (y0 + y1) / 2 - (phone ? 28 / kk : 0), k: kk };
  })();
  const k = Math.min(K_MAX, Math.max(kMin, view.k));
  const clampView = useCallback((v: View): View => ({ k: v.k, cx: Math.min(x1, Math.max(x0, v.cx)), cy: Math.min(y1, Math.max(y0, v.cy)) }), [x0, x1, y0, y1]);
  const toScreen = useCallback((px: number, py: number) => ({ x: (px - view.cx) * k + size.w / 2, y: (py - view.cy) * k + size.h / 2 }), [view.cx, view.cy, k, size.w, size.h]);

  // Flying to a place or a set of places.
  const raf = useRef(0);
  const fly = useCallback(
    (to: View) => {
      cancelAnimationFrame(raf.current);
      const target = clampView({ ...to, k: Math.min(K_MAX, Math.max(kMin, to.k)) });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setView(target);
      const from = view;
      const t0 = performance.now();
      const step = (t: number) => {
        const u = Math.min(1, (t - t0) / 650);
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        // Zoom in the log space so it feels even.
        setView({ cx: from.cx + (target.cx - from.cx) * e, cy: from.cy + (target.cy - from.cy) * e, k: Math.exp(Math.log(from.k) + (Math.log(target.k) - Math.log(from.k)) * e) });
        if (u < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [view, clampView, kMin],
  );
  const flyToPlace = useCallback((slug: string, kk = 0.95) => {
    const p = bySlug.get(slug);
    // On a phone the drawer is a sheet over the lower part of the map: the place goes in the upper part.
    if (p) fly({ cx: p.px, cy: p.py + (size.w < 700 ? (size.h * 0.2) / Math.max(kk, 0.01) : 0), k: Math.max(kk, 0) });
  }, [bySlug, fly, size.w, size.h]);

  // Panning and zooming.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ x: number; y: number; cx: number; cy: number; dist: number; k: number; moved: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a, button, input, select, [data-nodrag]")) return;
    cancelAnimationFrame(raf.current);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
    const pts = [...pointers.current.values()];
    gesture.current = { x: pts[0].x, y: pts[0].y, cx: view.cx, cy: view.cy, dist: pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0, k, moved: 0 };
  };
  const zoomAt = useCallback(
    (next: number, sx: number, sy: number, from: View = view) => {
      const kk = Math.min(K_MAX, Math.max(kMin, next));
      const px = (sx - size.w / 2) / from.k + from.cx;
      const py = (sy - size.h / 2) / from.k + from.cy;
      setView(clampView({ k: kk, cx: px - (sx - size.w / 2) / kk, cy: py - (sy - size.h / 2) / kk }));
    },
    [view, kMin, size.w, size.h, clampView],
  );
  const onMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const rect = box.current!.getBoundingClientRect();
    if (pts.length > 1 && g.dist) {
      zoomAt(g.k * (Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) / g.dist), (pts[0].x + pts[1].x) / 2 - rect.left, (pts[0].y + pts[1].y) / 2 - rect.top, { cx: g.cx, cy: g.cy, k: g.k });
      return;
    }
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    g.moved = Math.max(g.moved, Math.hypot(dx, dy));
    setView(clampView({ k, cx: g.cx - dx / k, cy: g.cy - dy / k }));
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (!pointers.current.size && gesture.current) gesture.current = gesture.current.moved > 5 ? { ...gesture.current, dist: 0 } : null;
  };
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-scroll]")) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(k * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [k, zoomAt]);

  // What is picked, drawn and filtered.
  const [selected, setSelected] = useState<string | null>(initial.place);
  const [drawer, setDrawer] = useState<Drawer | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [showRoute, setShowRoute] = useState(true);
  const [types, setTypes] = useState<string[]>(initial.types);
  const [danger, setDanger] = useState<[number, number]>(initial.danger);
  const [onlyQuests, setOnlyQuests] = useState(initial.onlyQuests);
  const [characters, setCharacters] = useState<{ id: string; name: string }[]>([]);
  const [characterId, setCharacterId] = useState<string | null>(initial.character);
  const [character, setCharacter] = useState<MapCharacter | null>(null);
  // On a phone the panel starts folded to its bar, so the map is what you see first.
  useEffect(() => {
    if (window.matchMedia("(max-width: 700px)").matches) queueMicrotask(() => setPanelOpen(false));
  }, []);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<MapSearch | null>(null);
  const search = useRef<HTMLInputElement>(null);

  const select = useCallback(
    (slug: string | null, fly_ = false) => {
      setSelected(slug);
      // The second sheet on a phone: the panel folds to its bar under the drawer.
      if (slug && size.w < 700) setPanelOpen(false);
      if (slug && fly_) flyToPlace(slug);
    },
    [flyToPlace, size.w],
  );
  useEffect(() => {
    if (!selected) return;
    let live = true;
    fetch(`/api/map/place?slug=${encodeURIComponent(selected)}`).then((r) => (r.ok ? r.json() : null)).then((d) => live && setDrawer(d));
    return () => {
      live = false;
    };
  }, [selected]);

  const loadRoute = useCallback(
    async (slug: string) => {
      const r = await fetch(`/api/map/quest?slug=${encodeURIComponent(slug)}`);
      if (!r.ok) return;
      const d = (await r.json()) as Route;
      setRoute(d);
      setShowRoute(true);
      setSelected(null);
      const stops = d.stops.map((x) => bySlug.get(x.slug)).filter((x): x is MapPlace => !!x);
      if (stops.length) {
        const xs = stops.map((p) => p.px);
        const ys = stops.map((p) => p.py);
        const dx = Math.max(...xs) - Math.min(...xs) + 1;
        const dy = Math.max(...ys) - Math.min(...ys) + 1;
        fly({ cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2, k: Math.min(0.9, (size.w * 0.55) / dx, (size.h * 0.55) / dy) });
      }
    },
    [bySlug, fly, size.w, size.h],
  );
  const firstRoute = useRef(initial.quest);
  useEffect(() => {
    if (firstRoute.current) {
      void loadRoute(firstRoute.current);
      firstRoute.current = null;
    }
    // Once, from the address.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Characters, signed in.
  useEffect(() => {
    if (!signedIn) return;
    fetch("/api/map/characters").then((r) => r.json()).then(setCharacters);
  }, [signedIn]);
  useEffect(() => {
    if (!characterId) return;
    let live = true;
    fetch(`/api/map/character?id=${encodeURIComponent(characterId)}`).then((r) => (r.ok ? r.json() : null)).then((d: MapCharacter | null) => {
      if (!live) return;
      setCharacter(d);
      if (d?.place && !initial.place && !initial.x) flyToPlace(d.place.slug, 0.6);
    });
    return () => {
      live = false;
    };
    // The character is fetched when it is picked; the flight is a one-off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  // Search as you type.
  useEffect(() => {
    if (!q.trim()) return;
    const t = setTimeout(() => fetch(`/api/map/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).then(setResults), 140);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) {
        e.preventDefault();
        setPanelOpen(true);
        search.current?.focus();
      } else if (e.key === "Escape") {
        if (selected) setSelected(null);
        else if (q) setQ("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, q]);
  const pickPerson = async (slug: string) => {
    const r = await fetch(`/api/map/person?slug=${encodeURIComponent(slug)}`);
    if (!r.ok) return;
    const d = (await r.json()) as { place: { slug: string } | null };
    setQ("");
    if (d.place) select(d.place.slug, true);
  };

  // The address keeps the view.
  useEffect(() => {
    const t = setTimeout(() => {
      const u = new URL(window.location.href);
      const set = (key: string, v: string | null) => (v === null || v === "" ? u.searchParams.delete(key) : u.searchParams.set(key, v));
      set("place", selected);
      set("quest", route ? (route.href.split("/").pop() ?? null) : null);
      set("character", characterId);
      set("types", types.join(","));
      set("danger", danger[0] > 1 || danger[1] < 50 ? `${danger[0]}-${danger[1]}` : null);
      set("quests", onlyQuests ? "1" : null);
      set("z", k.toFixed(3));
      set("x", String(Math.round(view.cx)));
      set("y", String(Math.round(view.cy)));
      window.history.replaceState(null, "", u);
    }, 250);
    return () => clearTimeout(t);
  }, [selected, route, characterId, types, danger, onlyQuests, k, view.cx, view.cy]);

  // Filters: what is out fades.
  const dangerOn = danger[0] > 1 || danger[1] < 50;
  const inRoute = useMemo(() => new Map((showRoute && route ? route.stops : []).map((x, i) => [x.slug, i + 1])), [route, showRoute]);
  const lit = useMemo(() => new Set((characterId && character?.id === characterId ? character.lit : []).map((x) => x.slug)), [character, characterId]);
  const shows = (p: MapPlace) => {
    if (selected === p.slug || inRoute.has(p.slug) || lit.has(p.slug)) return true;
    if (types.length && !types.includes(groupOf(p.type))) return false;
    if (onlyQuests && !p.quests) return false;
    if (dangerOn && !(p.kind === "danger" && p.range && p.range[0] <= danger[1] && p.range[1] >= danger[0])) return false;
    if (inRoute.size && route && showRoute) return false;
    return true;
  };
  // The kinds a player would pick (WO-167 review): about ten groups of the records' types, the same as on Places.
  const groupCounts = useMemo(() => {
    const m = places.reduce((acc, p) => acc.set(groupOf(p.type), (acc.get(groupOf(p.type)) ?? 0) + 1), new Map<string, number>());
    return PLACE_GROUPS.map((g) => ({ ...g, n: m.get(g.key) ?? 0 })).filter((g) => g.n > 0);
  }, [places]);
  const shownCount = places.filter(shows).length;

  // What to draw: clusters at a distance, names as you come in.
  const items = useMemo(() => {
    const out: { p: MapPlace; x: number; y: number; on: boolean; named: boolean }[] = [];
    for (const p of places) {
      const { x, y } = toScreen(p.px, p.py);
      if (x < -60 || y < -40 || x > size.w + 60 || y > size.h + 40) continue;
      const on = shows(p);
      const picked = selected === p.slug || inRoute.has(p.slug) || lit.has(p.slug);
      out.push({ p, x, y, on, named: picked || p.kind === "city" || (p.kind === "town" && k >= 0.28) || k >= 0.85 });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, toScreen, size.w, size.h, k, selected, types, onlyQuests, danger, inRoute, lit]);
  // Counts only where pins really pile up (WO-169 review): places less than about 14 px apart (their diamonds touch) are one count, so the opening view is diamonds with
  // the cities named. What a filter took out is not counted, and the picked place, a route's stops and a character's act never are.
  const { singles, clusters } = useMemo(() => {
    if (k >= 0.6) return { singles: items, clusters: [] as { x: number; y: number; n: number; px: number; py: number }[] };
    const singles: typeof items = [];
    const groups: { x: number; y: number; members: typeof items }[] = [];
    for (const it of items) {
      if (!it.on || it.p.kind === "city" || selected === it.p.slug || inRoute.has(it.p.slug) || lit.has(it.p.slug)) {
        singles.push(it);
        continue;
      }
      const g = groups.find((x) => Math.hypot(x.x - it.x, x.y - it.y) < (size.w < 700 ? 22 : 14));
      if (g) {
        g.members.push(it);
        g.x = g.members.reduce((a, m) => a + m.x, 0) / g.members.length;
        g.y = g.members.reduce((a, m) => a + m.y, 0) / g.members.length;
      } else groups.push({ x: it.x, y: it.y, members: [it] });
    }
    const clusters: { x: number; y: number; n: number; px: number; py: number }[] = [];
    for (const g of groups) {
      if (g.members.length === 1) singles.push(g.members[0]);
      else clusters.push({ x: g.x, y: g.y, n: g.members.length, px: g.members.reduce((a, m) => a + m.p.px, 0) / g.members.length, py: g.members.reduce((a, m) => a + m.p.py, 0) / g.members.length });
    }
    return { singles, clusters };
  }, [items, k, selected, inRoute, lit, size.w]);

  // The tiles in view: the half-size ones from afar, the full-size ones close in; the whole picture is under them while they load.
  const tileZoom = k < 0.5 ? 0 : 1;
  const tiles = useMemo(() => {
    const z = entry.tiles.zooms.find((t) => t.z === tileZoom);
    if (!z) return [];
    const span = (entry.tiles.size * entry.texture.width) / z.size;
    const l = Math.floor((view.cx - size.w / 2 / k) / span);
    const r = Math.floor((view.cx + size.w / 2 / k) / span);
    const t = Math.floor((view.cy - size.h / 2 / k) / span);
    const b = Math.floor((view.cy + size.h / 2 / k) / span);
    const out: { x: number; y: number; src: string; left: number; top: number; px: number }[] = [];
    for (let ty = Math.max(t, z.rows[0]); ty <= Math.min(b, z.rows[1]); ty++)
      for (let tx = Math.max(l, z.columns[0]); tx <= Math.min(r, z.columns[1]); tx++) {
        const sc = toScreen(tx * span, ty * span);
        out.push({ x: tx, y: ty, src: entry.tiles.url.replace("{z}", String(tileZoom)).replace("{x}", String(tx)).replace("{y}", String(ty)), left: sc.x, top: sc.y, px: span * k });
      }
    return out;
  }, [entry, tileZoom, view.cx, view.cy, k, size.w, size.h, toScreen]);
  const whole = toScreen(x0, y0);
  const routePoints = route && showRoute ? route.stops.map((x) => bySlug.get(x.slug)).filter((x): x is MapPlace => !!x).map((p) => toScreen(p.px, p.py)) : [];
  const charPlace = characterId && character?.id === characterId && character.place ? bySlug.get(character.place.slug) : null;
  const charAt = charPlace ? toScreen(charPlace.px, charPlace.py) : null;

  const resetNorth = () => {
    const kk = Math.min((size.w - beside - 24) / (x1 - x0), (size.h - (phone ? 56 : 24)) / (y1 - y0));
    fly({ cx: (x0 + x1) / 2 - beside / 2 / kk, cy: (y0 + y1) / 2 - (phone ? 28 / kk : 0), k: kk });
  };
  const openedDrawer = selected && drawer?.slug === selected ? drawer : null;
  const shownResults = q.trim() ? results : null;
  const shownCharacter = characterId && character?.id === characterId ? character : null;

  return (
    <div className={s.root}>
      <div
        ref={box}
        className={s.map}
        role="group"
        aria-label="Map of Skyrim"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => {
          if (gesture.current && gesture.current.moved > 5) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {/* The map's own frame: the pictures are cut to it, so the margins of the texture never show. */}
        <div className={s.frame} style={{ left: whole.x, top: whole.y, width: (x1 - x0) * k, height: (y1 - y0) * k }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.image.url} alt="" draggable={false} className={s.base} style={{ left: 0, top: 0, width: (x1 - x0) * k, height: (y1 - y0) * k }} />
          {tiles.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${tileZoom}_${t.x}_${t.y}`} src={t.src} alt="" draggable={false} className={s.tile} style={{ left: t.left - whole.x, top: t.top - whole.y, width: t.px + 1, height: t.px + 1 }} />
          ))}
        </div>

        {routePoints.length > 1 && (
          <svg className={s.svg} width={size.w} height={size.h} aria-hidden="true">
            <polyline points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#0d1219" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" opacity="0.7" />
            <polyline points={routePoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#f0913f" strokeWidth="2.4" strokeDasharray="9 7" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        )}

        {clusters.map((c, i) => (
          <button key={i} type="button" className={s.cluster} style={{ left: c.x, top: c.y }} aria-label={`${c.n} places, zoom in`} onClick={() => fly({ cx: c.px, cy: c.py, k: k * 2.6 })}>
            {c.n}
          </button>
        ))}
        {singles.map(({ p, x, y, on, named }) => {
          // A name near the window's right edge goes on the pin's left, so it is never cut off.
          const flip = named && x + 14 + (p.name.length * 7.4 + 22) > size.w - 6 && x - 14 - (p.name.length * 7.4 + 22) > 6;
          return (
          <div
            key={p.slug}
            className={`${s.pinBox} ${on ? "" : s.dim} ${selected === p.slug ? s.pickedBox : ""}`}
            style={{ left: x, top: y }}
            onClickCapture={(e) => {
              if (gesture.current && gesture.current.moved > 5) return;
              e.preventDefault();
              e.stopPropagation();
              select(p.slug === selected ? null : p.slug, false);
            }}
          >
            <PreviewLink href={`/places/${p.slug}`} className={`${s.pin} ${s[KIND_COLOUR[p.kind]]} ${selected === p.slug ? s.picked : ""} ${flip ? s.flip : ""}`}>
              <i aria-hidden="true">{inRoute.get(p.slug) ?? ""}</i>
              {named ? <span className={s.plate}>{p.name}</span> : <span className={s.sr}>{p.name}</span>}
            </PreviewLink>
          </div>
          );
        })}
        {charAt && shownCharacter && (
          <div className={s.pinBox} style={{ left: charAt.x, top: charAt.y }}>
            <span className={s.me} data-testid="my-character">
              <i aria-hidden="true">{shownCharacter.name.charAt(0)}</i>
              <span className={s.plate}>{shownCharacter.label}</span>
            </span>
          </div>
        )}
      </div>

      {/* The left panel (a sheet from the bottom on a phone): search first. */}
      <aside className={`${s.panel} ${panelOpen ? "" : s.panelFolded}`} aria-label="Map controls" data-nodrag="">
        <button type="button" className={s.fold} aria-expanded={panelOpen} onClick={() => setPanelOpen((o) => !o)}>
          <span>{panelOpen ? "Fold" : "Search and filters"}</span>
        </button>
        {panelOpen && (
          <div className={s.panelBody} data-scroll="">
            <div className={s.head}>
              <h1 className={s.title}>Map</h1>
              <span className={s.count}>{shownCount === places.length ? `${places.length} places` : `${shownCount} of ${places.length} places`}</span>
            </div>
            <div className={s.searchBox}>
              <input ref={search} type="search" role="combobox" aria-expanded={!!shownResults} aria-controls="map-results" aria-label="Search the map" placeholder="Search places, people, quests  /" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            </div>
            {shownResults && (
              <div id="map-results" role="listbox" aria-label="Results" className={s.results}>
                {shownResults.places.map((r) => (
                  <button key={`p-${r.slug}`} role="option" aria-selected="false" type="button" className={s.result} onClick={() => (setQ(""), select(r.slug, true))}>
                    <b>{r.name}</b>
                    <span className={s.kindTag}>Place</span>
                    <small>{[r.note, r.range].filter(Boolean).join(" | ")}</small>
                  </button>
                ))}
                {shownResults.people.map((r) => (
                  <button key={`h-${r.slug}`} role="option" aria-selected="false" type="button" className={s.result} onClick={() => void pickPerson(r.slug)}>
                    <b>{r.name}</b>
                    <span className={s.kindTag}>Person</span>
                    <small>{r.note}</small>
                  </button>
                ))}
                {shownResults.quests.map((r) => (
                  <button key={`q-${r.slug}`} role="option" aria-selected="false" type="button" className={s.result} onClick={() => (setQ(""), void loadRoute(r.slug))}>
                    <b>{r.name}</b>
                    <span className={s.kindTag}>Quest</span>
                    <small>{r.note}</small>
                  </button>
                ))}
                {!shownResults.places.length && !shownResults.people.length && !shownResults.quests.length && <p className={s.none}>Nothing on the map by that name.</p>}
              </div>
            )}

            <section aria-label="Show" className={s.group}>
              <h2 className={s.h2}>Show</h2>
              <div className={s.chips}>
                <button type="button" className={`${s.chip} ${!types.length ? s.chipOn : ""}`} onClick={() => setTypes([])}>
                  All
                </button>
                {groupCounts.map((g) => (
                  <button key={g.key} type="button" aria-pressed={types.includes(g.key)} className={`${s.chip} ${types.includes(g.key) ? s.chipOn : ""}`} onClick={() => setTypes((cur) => (cur.includes(g.key) ? cur.filter((x) => x !== g.key) : [...cur, g.key]))}>
                    {g.label} <small>{g.n}</small>
                  </button>
                ))}
              </div>
            </section>

            <section aria-label="Danger" className={s.group}>
              <h2 className={s.h2}>
                Danger <small>{danger[0] === 1 && danger[1] === 50 ? "any level" : `level ${danger[0]} to ${danger[1] === 50 ? "50 and up" : danger[1]}`}</small>
              </h2>
              <div className={s.range}>
                <input type="range" min={1} max={50} value={danger[0]} aria-label="Lowest level" onChange={(e) => setDanger(([, h]) => [Math.min(Number(e.target.value), h), h])} />
                <input type="range" min={1} max={50} value={danger[1]} aria-label="Highest level" onChange={(e) => setDanger(([l]) => [l, Math.max(Number(e.target.value), l)])} />
              </div>
            </section>

            <section aria-label="On the map" className={s.group}>
              <h2 className={s.h2}>On the map</h2>
              {route && (
                <label className={s.check}>
                  <input type="checkbox" checked={showRoute} onChange={(e) => setShowRoute(e.target.checked)} />
                  <span>
                    The route of <Link href={route.href}>{route.name}</Link> <small>{route.stops.length} {route.stops.length === 1 ? "place" : "places"}</small>
                  </span>
                  <button type="button" className={s.clear} onClick={() => setRoute(null)} aria-label="Clear the route">
                    ×
                  </button>
                </label>
              )}
              {signedIn && characters.length > 0 && (
                <label className={s.check}>
                  <span>Where my character is</span>
                  <select value={characterId ?? ""} onChange={(e) => setCharacterId(e.target.value || null)} aria-label="Where my character is">
                    <option value="">None</option>
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className={s.check}>
                <input type="checkbox" checked={onlyQuests} onChange={(e) => setOnlyQuests(e.target.checked)} />
                <span>Only places with a quest</span>
              </label>
            </section>
          </div>
        )}
      </aside>

      {openedDrawer && (
        <aside className={s.drawer} aria-label={openedDrawer.name} data-nodrag="" data-scroll="">
          <button type="button" className={s.close} aria-label="Close" onClick={() => setSelected(null)}>
            ×
          </button>
          <h2 className={s.dTitle}>{openedDrawer.name}</h2>
          <p className={s.tags}>{openedDrawer.tags.join(" | ")}</p>
          {openedDrawer.gettingThere && <p className={s.line}>{openedDrawer.gettingThere}</p>}
          {openedDrawer.boss && (
            <p className={s.line}>
              <b>The boss:</b> {openedDrawer.boss.name}
              {openedDrawer.boss.level ? `, level ${openedDrawer.boss.level}` : ""}
            </p>
          )}
          {openedDrawer.inside.length > 0 && (
            <>
              <h3 className={s.h3}>Who is inside</h3>
              <p className={s.line}>
                {openedDrawer.inside.map((x, i) => (
                  <span key={x.href}>
                    {i ? ", " : ""}
                    <Link href={x.href}>{x.name}</Link>
                  </span>
                ))}
              </p>
            </>
          )}
          {openedDrawer.rewards.length > 0 && (
            <>
              <h3 className={s.h3}>Rewards</h3>
              <p className={s.line}>{openedDrawer.rewards.join("; ")}</p>
            </>
          )}
          {openedDrawer.worth.length > 0 && (
            <>
              <h3 className={s.h3}>Worth it</h3>
              <ul className={s.ul}>
                {openedDrawer.worth.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </>
          )}
          {openedDrawer.quests.length > 0 && (
            <>
              <h3 className={s.h3}>Quests that bring you here</h3>
              <ul className={s.ul}>
                {openedDrawer.quests.map((x) => (
                  <li key={x.href}>
                    <Link href={x.href}>{x.name}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link href={openedDrawer.href} className={`btn btn-primary ${s.open}`}>
            Open the page
          </Link>
        </aside>
      )}

      <div className={s.controls} data-nodrag="">
        <button type="button" className={s.plate} aria-label="Zoom in" onClick={() => zoomAt(k * 1.5, size.w / 2, size.h / 2)}>
          +
        </button>
        <button type="button" className={s.plate} aria-label="Zoom out" onClick={() => zoomAt(k / 1.5, size.w / 2, size.h / 2)}>
          −
        </button>
        <button type="button" className={s.plate} aria-label="North, and the whole map" onClick={resetNorth}>
          N
        </button>
      </div>
      {/* The credit its author asked for, on every view and zoom. */}
      <a className={`${s.plate} ${s.credit}`} href={entry.credit.url} target="_blank" rel="noreferrer" data-nodrag="">
        Map: {entry.credit.text} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
