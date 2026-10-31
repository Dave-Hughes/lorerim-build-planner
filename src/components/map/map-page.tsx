"use client";

import { BUTTON_STEP, wheelFactor } from "@/lib/map/zoom";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PreviewLink } from "@/components/pages/preview-link";
import type { Drawer, MapCharacter, MapPlace, MapSearch } from "@/lib/map/data";
import { PLACE_GROUPS, groupOf } from "@/lib/places/groups";
import type { MapEntry } from "@/lib/places/map";
import s from "./map-page.module.css";

/**
 * The Map page (WO-169). The paper map fills the window; drag to pan, wheel or pinch to zoom. Pins cluster into counts at a distance and show
 * their names as you come in. The left panel searches places, people and quests and filters what shows (what is filtered out is not drawn); a
 * place opens a drawer. The address keeps the view. The credit and link the map's author asked for are in the corner on every view.
 */
export interface MapInitial {
  place: string | null;
  quest: string | null;
  character: string | null;
  types: string[];
  onlyQuests: boolean;
  /** An act's stops, in order, as a route (WO-181: "Open on the map" from the Playthrough tab). */
  stops?: Route | null;
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

type Side = "right" | "left" | "above" | "below";

/**
 * How wide a name's plate is drawn, a little over: the name measured in the page's own font at the plate's 12.5px, plus its 16 px of padding and
 * 2 of border and 3 more to spare (WO-180 Part 6b: 6.5 a letter ran under for Reachwater Rock and Whiterun and over for others; 7.4 dropped names
 * that had room). Before the font is known, or with no canvas, 7 a letter.
 */
let canvas: CanvasRenderingContext2D | null | undefined;
const widths = new Map<string, number>();
function plateOf(name: string): number {
  const hit = widths.get(name);
  if (hit !== undefined) return hit;
  if (canvas === undefined) canvas = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  let text = name.length * 7;
  if (canvas) {
    canvas.font = `12.5px ${getComputedStyle(document.body).fontFamily}`;
    text = canvas.measureText(name).width;
  }
  const w = Math.ceil(text) + 16 + 2 + 3;
  widths.set(name, w);
  return w;
}
const plateWidth = (name: string) => plateOf(name);

/** Where a plate goes round its pin (WO-180 Part 6b: above and below too): beside it on either side, or centred over or under it. */
type Box = [number, number, number, number];
const boxAt = (x: number, y: number, w: number, side: Side): Box =>
  side === "right" ? [x + 8, y - 12, x + 14 + w, y + 12] : side === "left" ? [x - 14 - w, y - 12, x - 8, y + 12] : side === "above" ? [x - w / 2, y - 35, x + w / 2, y - 7] : [x - w / 2, y + 7, x + w / 2, y + 35];

export function MapPage({ entry, places, initial }: { entry: MapEntry; places: MapPlace[]; initial: MapInitial }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1440, h: 800 });
  const [measured, setMeasured] = useState(false);
  // The names are measured again once the page's font has loaded (WO-180 Part 6b).
  const [fontTick, setFontTick] = useState(0);
  useEffect(() => {
    document.fonts?.ready.then(() => {
      widths.clear();
      setFontTick((n) => n + 1);
    });
  }, []);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    setMeasured(true);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [x0, y0, x1, y1] = entry.border;
  // A little further out than the window fits, so the whole map can sit beside the panel.
  // On a phone it goes further out, so a quest whose stops are the width of Skyrim (Forbidden Legend) shows every one (WO-177 Part 5: only stop 1 did).
  const kMin = Math.min(size.w / (x1 - x0), size.h / (y1 - y0)) * (size.w < 700 ? 0.5 : 0.8);
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
    // On a phone the map opens filling the screen's height, panned to the middle of Skyrim; beside a panel it is fitted whole.
    const kk = phone ? (size.h - 56) / (y1 - y0) : Math.min((size.w - beside - 24) / (x1 - x0), (size.h - 24) / (y1 - y0));
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
    // A press on a pin or a button starts no drag, and an earlier drag's mark is gone: left in place it made every pin click after a pan read as the end of that drag (WO-185 Part 2).
    gesture.current = null;
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
      zoomAt(k * wheelFactor(e), e.clientX - rect.left, e.clientY - rect.top);
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
  const [onlyQuests, setOnlyQuests] = useState(initial.onlyQuests);
  // Where a character is stays in the address (?character=) for the playthrough pages to use; the panel no longer offers it (WO-174).
  const characterId = initial.character;
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

  const showRouteOf = useCallback(
    (d: Route) => {
      setRoute(d);
      setShowRoute(true);
      setSelected(null);
      const stops = d.stops.map((x) => bySlug.get(x.slug)).filter((x): x is MapPlace => !!x);
      if (stops.length) {
        const xs = stops.map((p) => p.px);
        const ys = stops.map((p) => p.py);
        const dx = Math.max(...xs) - Math.min(...xs) + 1;
        const dy = Math.max(...ys) - Math.min(...ys) + 1;
        // The box as it is now (a route in the address loads before the first measure settles), and on a phone the part above the sheet's bar (WO-177: only stop 1 showed).
        const w = box.current?.clientWidth || size.w;
        const h = box.current?.clientHeight || size.h;
        const small = w < 700;
        const usableW = small ? w * 0.8 : w - (panelOpen ? 354 : 0) - 120;
        const usableH = small ? (h - 70) * 0.8 : h * 0.7;
        const kk = Math.min(0.9, usableW / dx, usableH / dy);
        fly({ cx: (Math.min(...xs) + Math.max(...xs)) / 2 - (small ? 0 : panelOpen ? 177 / kk : 0), cy: (Math.min(...ys) + Math.max(...ys)) / 2 + (small ? 28 / kk : 0), k: kk });
      }
    },
    [bySlug, fly, size.w, size.h, panelOpen],
  );
  const loadRoute = useCallback(
    async (slug: string) => {
      const r = await fetch(`/api/map/quest?slug=${encodeURIComponent(slug)}`);
      if (!r.ok) return;
      showRouteOf((await r.json()) as Route);
    },
    [showRouteOf],
  );
  const firstRoute = useRef(initial.quest);
  const firstStops = useRef(initial.stops ?? null);
  // Once, from the address, and once the box is measured: the fit and the furthest zoom-out are worked out from the real window (WO-177 Part 5).
  useEffect(() => {
    if (!measured) return;
    if (firstRoute.current) {
      void loadRoute(firstRoute.current);
      firstRoute.current = null;
    } else if (firstStops.current) {
      showRouteOf(firstStops.current);
      firstStops.current = null;
    }
  }, [measured, loadRoute, showRouteOf]);

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
      const ofQuest = route?.href.startsWith("/quests/") ?? false;
      set("quest", route && ofQuest ? (route.href.split("/").pop() ?? null) : null);
      set("stops", route && !ofQuest ? route.stops.map((x) => x.slug).join(",") : null);
      set("route", route && !ofQuest ? route.name : null);
      set("character", characterId);
      set("types", types.join(","));
      set("quests", onlyQuests ? "1" : null);
      set("z", k.toFixed(3));
      set("x", String(Math.round(view.cx)));
      set("y", String(Math.round(view.cy)));
      window.history.replaceState(null, "", u);
    }, 250);
    return () => clearTimeout(t);
  }, [selected, route, characterId, types, onlyQuests, k, view.cx, view.cy]);

  // Filters: what is out is not drawn.
  const inRoute = useMemo(() => new Map((showRoute && route ? route.stops : []).map((x, i) => [x.slug, i + 1])), [route, showRoute]);
  const lit = useMemo(() => new Set((characterId && character?.id === characterId ? character.lit : []).map((x) => x.slug)), [character, characterId]);
  const shows = (p: MapPlace) => {
    if (selected === p.slug || inRoute.has(p.slug) || lit.has(p.slug)) return true;
    // A place inside a town has the town's pin: drawn only when its kind is picked (WO-178).
    if (p.inTown && !types.includes(groupOf(p.type))) return false;
    if (types.length && !types.includes(groupOf(p.type))) return false;
    if (onlyQuests && !p.quests) return false;
    if (inRoute.size && route && showRoute) return false;
    return true;
  };
  // The kinds a player would pick (WO-167 review): about ten groups of the records' types, the same as on Places.
  const groupCounts = useMemo(() => {
    const m = places.reduce((acc, p) => acc.set(groupOf(p.type), (acc.get(groupOf(p.type)) ?? 0) + 1), new Map<string, number>());
    return PLACE_GROUPS.map((g) => ({ ...g, n: m.get(g.key) ?? 0 })).filter((g) => g.n > 0);
  }, [places]);
  // A place inside a town counts as shown whenever the filters let it through, though with no kind picked it is folded into its town's pin.
  const shownCount = places.filter((p) => (p.inTown && selected !== p.slug ? (!types.length || types.includes(groupOf(p.type))) && (!onlyQuests || !!p.quests) && !(inRoute.size && route && showRoute) : shows(p))).length;

  // What sits over the map, in its own pixels: the panel, the drawer, the zoom buttons and the credit (WO-177). A pin under the panel or the drawer
  // is not drawn at all, with its name or its badge; a name is never drawn under any of them.
  const covered = useMemo<{ over: Box[]; sheet: Box[] }>(() => {
    const wide = size.w >= 700;
    const shift = selected && wide ? 352 : 0;
    const sheet: Box[] = wide
      ? [panelOpen ? [12, 12, 342, size.h - 12] : [12, 12, 342, 64], ...(selected ? ([[size.w - 352, 12, size.w - 12, size.h - 12]] as Box[]) : [])]
      : [[0, size.h - (selected ? size.h * 0.58 : panelOpen ? size.h * 0.52 : 56), size.w, size.h]];
    const over: Box[] = wide
      ? [[size.w - 12 - 36 - shift - 6, size.h - 52 - 120 - 6, size.w - 12 - shift + 6, size.h - 52 + 6], [size.w - 12 - 290 - shift, size.h - 12 - 34, size.w - 12 - shift, size.h - 12]]
      : [[size.w - 12 - 36 - 6, 12 - 6, size.w - 6, 12 + 120 + 6], [8, 8, size.w - 84, 40]];
    return { over, sheet };
  }, [size.w, size.h, selected, panelOpen]);
  const underSheet = useCallback((x: number, y: number) => y < 10 || covered.sheet.some((o) => x > o[0] - 6 && x < o[2] + 6 && y > o[1] - 6 && y < o[3] + 6), [covered]);
  // What to draw: names as you come in, and never two plates on top of each other (WO-169 review): the more important name stays (the picked
  // place, a route's stops, the cities, then the towns) and the lesser one is dropped.
  const items = useMemo(() => {
    const blockedBox = (b: Box) => b[0] < 6 || b[2] > size.w - 6 || [...covered.sheet, ...covered.over].some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    type Item = { p: MapPlace; x: number; y: number; named: boolean; side: Side; label: string; picked: boolean; ok: Record<Side, boolean>; members?: string[] };
    const out: Item[] = [];
    for (const p of places) {
      const { x, y } = toScreen(p.px, p.py);
      if (x < -60 || y < -40 || x > size.w + 60 || y > size.h + 40) continue;
      if (!shows(p)) continue;
      const picked = selected === p.slug || inRoute.has(p.slug) || lit.has(p.slug);
      if (!picked && underSheet(x, y)) continue;
      out.push({ p, x, y, named: false, side: "right", label: p.name, picked, ok: { right: true, left: true, above: true, below: true } });
    }
    // Places inside one town are one pin, a count on the town's plate (WO-178): "Whiterun, 5 places". The plate is the label's width from the start,
    // so every name is placed around it (WO-180 Part 6b: Anga's Mill sat on "Windhelm, 24").
    const folded = new Map<string, string[]>();
    for (const it of out) if (it.p.inTown && selected !== it.p.slug && !inRoute.has(it.p.slug)) folded.set(it.p.inTown.slug, [...(folded.get(it.p.inTown.slug) ?? []), it.p.name]);
    const seenTown = new Set<string>();
    const drawn = out.flatMap((it): Item[] => {
      const t = it.p.inTown;
      if (!t || selected === it.p.slug || inRoute.has(it.p.slug)) return [it];
      const names = folded.get(t.slug) ?? [it.p.name];
      if (seenTown.has(t.slug)) return [];
      seenTown.add(t.slug);
      // At every zoom the town's pin carries its count, and hovering it lists the places of the picked kind (WO-178 Part 3).
      const label = names.length > 1 ? `${t.name}, ${names.length}` : names[0];
      return [{ ...it, label, members: names, p: { ...it.p, slug: t.slug, name: label } }];
    });
    for (const it of drawn) {
      const w = plateWidth(it.label);
      for (const sd of ["right", "left", "above", "below"] as Side[]) it.ok[sd] = !blockedBox(boxAt(it.x, it.y, w, sd));
      // A name goes on the pin's right, or its left when the right is under a control, the panel or the drawer, or off the edge; above or below
      // when neither is clear; with none clear it is not drawn (WO-177). The picked place is always named.
      it.side = it.ok.right ? "right" : it.ok.left ? "left" : it.ok.above ? "above" : it.ok.below ? "below" : "right";
      const any = it.ok.right || it.ok.left || it.ok.above || it.ok.below;
      it.named = it.members ? any : (it.picked || any) && (it.picked || it.p.kind === "city" || (it.p.kind === "town" && k >= 0.28) || k >= 0.85);
    }
    const rank = (it: Item) => (it.picked ? 0 : it.p.kind === "city" ? 1 : it.members || it.p.kind === "town" ? 2 : 3);
    const taken: Box[] = [];
    // Within a rank the name with fewest sides to go on is placed first, so a stop at the edge keeps the side it has (WO-180 Part 5b: Saarthal).
    const sidesLeft = (it: Item) => Object.values(it.ok).filter(Boolean).length;
    for (const it of [...drawn].sort((a, b) => rank(a) - rank(b) || sidesLeft(a) - sidesLeft(b))) {
      if (!it.named) continue;
      const w = plateWidth(it.label);
      // A route's stops come first; two that would overlap show their numbers only (WO-180). A name never runs under another stop's number
      // either (WO-180 Part 4b: Saarthal's 3 under "Folgunthur" once zoomed out), at every zoom, since this is worked out again with each.
      const free = (box: Box) => !drawn.some((o) => o !== it && inRoute.has(o.p.slug) && box[0] < o.x + 12 && box[2] > o.x - 12 && box[1] < o.y + 12 && box[3] > o.y - 12) && !taken.some((t) => box[0] < t[2] && box[2] > t[0] && box[1] < t[3] && box[3] > t[1]);
      // The other side is tried before a name is dropped (WO-180 Part 5b: both stops of The Golden Claw lost theirs with room left and right), and
      // then above and below (Part 6b: a 1 to 4 px collision dropped both at 390).
      const order = (it.side === "left" ? ["left", "right", "above", "below"] : ["right", "left", "above", "below"]) as Side[];
      const side = order.find((sd) => it.ok[sd] && free(boxAt(it.x, it.y, w, sd)));
      if (!side) it.named = false;
      else {
        it.side = side;
        taken.push(boxAt(it.x, it.y, w, side));
      }
    }
    return drawn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, toScreen, size.w, size.h, k, selected, types, onlyQuests, inRoute, lit, covered, fontTick]);
  // Counts only where pins really pile up (WO-169 review): places less than about 14 px apart (their diamonds touch) are one count, so the opening view is diamonds with
  // the cities named. What a filter took out is not counted, and the picked place, a route's stops and a character's act never are.
  const { singles, clusters } = useMemo(() => {
    if (k >= 0.6) return { singles: items, clusters: [] as { x: number; y: number; n: number; px: number; py: number }[] };
    const singles: typeof items = [];
    const groups: { x: number; y: number; members: typeof items }[] = [];
    for (const it of items) {
      if (it.p.kind === "city" || selected === it.p.slug || inRoute.has(it.p.slug) || lit.has(it.p.slug)) {
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
    // A count that falls on a city's label is that city's: "Whiterun 2", not a badge under its name (WO-177 Part 6).
    const withCity = new Map<string, number>();
    const kept = clusters.filter((c) => {
      if (underSheet(c.x, c.y)) return false;
      // A badge is not drawn under a control either: the zoom buttons, the N, the search (WO-180 Part 4b: a count poking out behind the N on a phone).
      if (covered.over.some((o) => c.x + 14 > o[0] && c.x - 14 < o[2] && c.y + 14 > o[1] && c.y - 14 < o[3])) return false;
      // Nor behind a name's plate (WO-180 Part 6b: a "2" poking out behind "Markarth, 17").
      if (singles.some((it) => it.named && (() => { const b = boxAt(it.x, it.y, plateWidth(it.p.name), it.side); return c.x + 16 > b[0] && c.x - 16 < b[2] && c.y + 16 > b[1] && c.y - 16 < b[3]; })())) return false;
      const city = singles.find((it) => it.p.kind === "city" && Math.abs(it.x - c.x) < 90 && Math.abs(it.y - c.y) < 20);
      // With no kind picked a city's label has no number (WO-180: it was the nearby cluster, and changed with the zoom): the badge is not drawn.
      if (city) return false;
      return true;
    });
    return { singles: singles.map((it) => (withCity.has(it.p.slug) ? { ...it, extra: withCity.get(it.p.slug) } : it)), clusters: kept };
  }, [items, k, selected, inRoute, lit, size.w, underSheet, covered]);

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
    const kk = phone ? (size.h - 56) / (y1 - y0) : Math.min((size.w - beside - 24) / (x1 - x0), (size.h - 24) / (y1 - y0));
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
        {singles.map(({ p, x, y, named, side, ...rest }) => {
          const extra = (rest as { extra?: number }).extra;
          const members = (rest as { members?: string[] }).members;
          // A pin that holds several places of one kind lists them itself; the town's own card would cover the list.
          const PinLink = members && members.length > 1 ? Link : PreviewLink;
          // A name near the window's right edge goes on the pin's left, so it is never cut off.
          const flip = named && side === "left";
          const sideClass = named && side === "above" ? s.above : named && side === "below" ? s.below : "";
          return (
          <div
            key={p.slug}
            className={`${s.pinBox} ${selected === p.slug ? s.pickedBox : ""}`}
            style={{ left: x, top: y }}
            onClickCapture={(e) => {
              if (gesture.current && gesture.current.moved > 5) return;
              e.preventDefault();
              e.stopPropagation();
              select(p.slug === selected ? null : p.slug, false);
            }}
          >
            {members && members.length > 1 && (
              <span className={s.members} role="tooltip">
                {members.slice(0, 12).map((m) => (
                  <span key={m}>{m}</span>
                ))}
                {members.length > 12 ? <span>and {members.length - 12} more</span> : null}
              </span>
            )}
            <PinLink href={`/places/${p.slug}`} className={`${s.pin} ${s[KIND_COLOUR[p.kind]]} ${selected === p.slug ? s.picked : ""} ${flip ? s.flip : ""} ${sideClass}`}>
              <i aria-hidden="true">{inRoute.get(p.slug) ?? ""}</i>
              {named ? (
                <span className={s.plate}>
                  {p.name}
                  {extra ? <b className={s.plus}>{extra}</b> : null}
                </span>
              ) : (
                <span className={s.sr}>{p.name}</span>
              )}
            </PinLink>
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
        {/* A chevron in the corner folds the panel; folded, it is a bar that says what it opens. */}
        <button type="button" className={s.fold} aria-expanded={panelOpen} aria-label={panelOpen ? "Fold the panel" : "Open search and filters"} onClick={() => setPanelOpen((o) => !o)}>
          {!panelOpen && <span>Search and filters</span>}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {panelOpen && (
          <div className={s.panelBody} data-scroll="">
            <div className={s.head}>
              <h1 className={s.title}>Map</h1>
              <span className={s.count}>{shownCount === places.length ? `${places.length} places on the map` : `${shownCount} of ${places.length} places on the map`}</span>
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
                {/* All is lit only while nothing narrows the map: no kind, no "with a quest", no route (WO-177). */}
                <button
                  type="button"
                  aria-pressed={!types.length && !onlyQuests && !(route && showRoute)}
                  className={`${s.chip} ${!types.length && !onlyQuests && !(route && showRoute) ? s.chipOn : ""}`}
                  onClick={() => {
                    setTypes([]);
                    setOnlyQuests(false);
                    setRoute(null);
                  }}
                >
                  All
                </button>
                {groupCounts.map((g) => (
                  <button key={g.key} type="button" title={`${g.n} on the map`} aria-pressed={types.includes(g.key)} className={`${s.chip} ${types.includes(g.key) ? s.chipOn : ""}`} onClick={() => setTypes((cur) => (cur.includes(g.key) ? cur.filter((x) => x !== g.key) : [...cur, g.key]))}>
                    {g.label} <small>{g.n}</small>
                  </button>
                ))}
                <button type="button" aria-pressed={onlyQuests} className={`${s.chip} ${onlyQuests ? s.chipOn : ""}`} onClick={() => setOnlyQuests((o) => !o)}>
                  With a quest
                </button>
              </div>
              {/* What the numbers are, said in the panel: the chips' titles never show on a phone (WO-180 Part 4b). */}
              <p className={s.chipNote}>The number beside each kind is how many of them are on the map.</p>
            </section>

            {route && (
              <section aria-label="Route" className={s.group}>
                <label className={s.check}>
                  <input type="checkbox" checked={showRoute} onChange={(e) => setShowRoute(e.target.checked)} />
                  <span>
                    The route of <Link href={route.href}>{route.name}</Link> <small>{route.stops.length} {route.stops.length === 1 ? "place" : "places"}</small>
                  </span>
                  <button type="button" className={s.clear} onClick={() => setRoute(null)} aria-label="Clear the route">
                    ×
                  </button>
                </label>
              </section>
            )}
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
          {openedDrawer.danger && (
            <p className={s.line}>
              <b>Danger:</b> {openedDrawer.danger}
            </p>
          )}
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
        <button type="button" className={s.plate} aria-label="Zoom in" onClick={() => zoomAt(k * BUTTON_STEP, size.w / 2, size.h / 2)}>
          +
        </button>
        <button type="button" className={s.plate} aria-label="Zoom out" onClick={() => zoomAt(k / BUTTON_STEP, size.w / 2, size.h / 2)}>
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
