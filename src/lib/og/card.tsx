/**
 * The link-preview cards (WO-33; the pixel style, WO-88), 1200×630, drawn by next/og's ImageResponse
 * to the canvas artboards "ShareBuild", "ShareSitePixel" and "ShareGuide". Server only: it reads the
 * fonts, icons and art from disk. The pixel art comes from scripts/coming-soon/share.py already
 * scaled up pixel for pixel, so the renderer never smooths it.
 */
/* eslint-disable @next/next/no-img-element -- ImageResponse draws these to a PNG; next/image doesn't apply. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { CARD, SITE_LINE, SITE_NAME } from "./metadata";

const ROOT = process.cwd();
const C = { ground: "#0e1319", text: "#e4ebf0", soft: "#c3cdd6", muted: "#8e9bab", brass: "#b9a173", ember: "#f0913f", rule: "#2a3442", ruleStrong: "#3a4658", cream: "#f3ead8", page: "#ddd5c6" };

/** Only the three faces the cards use (ImageResponse can't read next/font's woff2). */
async function fonts() {
  const read = (f: string) => readFile(path.join(ROOT, "src", "lib", "og", "fonts", f));
  const [title, body, flavor] = await Promise.all([read("SofiaSansExtraCondensed-Bold.ttf"), read("SofiaSans-Medium.ttf"), read("Alegreya-Italic.ttf")]);
  return [
    { name: "Title", data: title, weight: 700 as const, style: "normal" as const },
    { name: "Body", data: body, weight: 500 as const, style: "normal" as const },
    { name: "Flavor", data: flavor, weight: 400 as const, style: "italic" as const },
  ];
}

/** Art baked by scripts/coming-soon/share.py (src/lib/og/art), as a data-URI PNG. */
async function art(file: string): Promise<string> {
  const png = await readFile(path.join(ROOT, "src", "lib", "og", "art", file));
  return `data:image/png;base64,${png.toString("base64")}`;
}

/** A pixel icon from public/icons as a data-URI SVG; drawn at whole multiples of 16 so it stays crisp. */
async function icon(file: string): Promise<string | null> {
  try {
    const svg = await readFile(path.join(ROOT, "public", "icons", `${file}.svg`));
    return `data:image/svg+xml;base64,${svg.toString("base64")}`;
  } catch {
    return null;
  }
}

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function Corners() {
  return (
    <>
      <div style={{ position: "absolute", top: 28, left: 28, width: 22, height: 22, borderTop: `2px solid ${C.brass}`, borderLeft: `2px solid ${C.brass}` }} />
      <div style={{ position: "absolute", top: CARD.height - 50, left: CARD.width - 50, width: 22, height: 22, borderBottom: `2px solid ${C.brass}`, borderRight: `2px solid ${C.brass}` }} />
    </>
  );
}

function StarMark({ size, stroke }: { size: number; stroke: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22">
      <path d="M11 1 L13 9 L21 11 L13 13 L11 21 L9 13 L1 11 L9 9 Z" fill="none" stroke={C.ember} strokeWidth={stroke} />
    </svg>
  );
}

/** A build with a video guide (WO-39): a small play badge in the card's top-right corner. */
function VideoBadge() {
  return (
    <div style={{ position: "absolute", top: 52, left: CARD.width - 64 - 150, width: 150, height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "rgba(0,0,0,0.66)", border: `1px solid ${C.ember}`, color: "#ffffff", fontFamily: "Title", fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase" }}>
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M7 4.5v15l12.5-7.5z" fill={C.ember} />
      </svg>
      Video
    </div>
  );
}

/** Cut text to `lines` lines of about `perLine` characters, ending in "…" (the renderer has no line clamp). */
function clampText(text: string, perLine: number, lines: number): string {
  const words = text.trim().split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= perLine) line = next;
    else {
      out.push(line);
      line = w;
      if (out.length === lines) return `${out.join(" ").replace(/[\s,.;:]+$/, "")}…`;
    }
  }
  if (line) out.push(line);
  return out.length > lines ? `${out.slice(0, lines).join(" ")}…` : out.join(" ");
}

/**
 * The site's card (WO-88, "ShareSitePixel"): the coming soon hero's night scene, faded on the left,
 * the pixel wordmark, the site's line and the version. A build with no cover gets this card with its
 * own name, set in the title face, in place of the wordmark.
 */
export async function siteCard({ title = SITE_NAME, version, video = false }: { title?: string; version: string; video?: boolean }) {
  const [scene, mark, star] = await Promise.all([art("site-scene.png"), title === SITE_NAME ? art("wordmark.png") : null, icon("logo-0")]);
  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", backgroundColor: "#070a0f", color: C.text, fontFamily: "Body" }}>
        <img src={scene} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630 }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(7,10,15,0.86) 0%, rgba(7,10,15,0.62) 34%, rgba(7,10,15,0) 56%)" }} />
        <Corners />
        <div style={{ position: "absolute", left: 72, top: 0, bottom: 0, width: 520, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          {mark ? (
            <img src={mark} alt={SITE_NAME} width={452} height={152} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {star && <img src={star} alt="" width={64} height={64} />}
              <div style={{ fontFamily: "Title", fontSize: 80, lineHeight: 0.9, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cream }}>{clampText(title, 16, 3)}</div>
            </div>
          )}
          <div style={{ fontFamily: "Flavor", fontStyle: "italic", fontSize: 30, lineHeight: 1.3, color: C.page }}>{SITE_LINE}</div>
          <div style={{ display: "flex" }}>
            <div style={{ border: `1px solid ${C.ruleStrong}`, backgroundColor: "rgba(7,10,15,0.6)", padding: "3px 12px", fontSize: 18, letterSpacing: "0.06em", color: C.soft }}>{`LoreRim ${version}`}</div>
          </div>
        </div>
        {video && <VideoBadge />}
      </div>
    ),
    { ...CARD, fonts: await fonts() },
  );
}

/**
 * A guide chapter's card (WO-88, "ShareGuide"): the icon wall faint behind, the chapter's number,
 * title and subtitle, its own icon in a box on the right, and the site's name at the foot.
 */
export async function guideCard(c: { number: number; title: string; subtitle?: string; icon?: string }) {
  const [wall, chapterIcon, star] = await Promise.all([art("guide-wall.png"), c.icon ? icon(c.icon) : null, icon("logo-0")]);
  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", backgroundColor: C.ground, color: C.text, fontFamily: "Body" }}>
        <img src={wall} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, opacity: 0.16 }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(14,19,25,0.92) 0%, rgba(14,19,25,0.7) 55%, rgba(14,19,25,0.35) 100%)" }} />
        <Corners />
        <div style={{ position: "absolute", left: 72, top: 0, bottom: 0, width: 640, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
          <div style={{ fontFamily: "Title", fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ember }}>{`LoreRim guide · Chapter ${c.number}`}</div>
          <div style={{ fontFamily: "Title", fontSize: 112, lineHeight: 0.9, letterSpacing: "0.03em", textTransform: "uppercase", color: C.cream }}>{clampText(c.title, 14, 2)}</div>
          {c.subtitle && <div style={{ fontFamily: "Flavor", fontStyle: "italic", fontSize: 30, lineHeight: 1.3, color: C.page }}>{clampText(c.subtitle, 42, 3)}</div>}
        </div>
        <div style={{ position: "absolute", left: 1200 - 96 - 320, top: (630 - 320) / 2, width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.rule}`, backgroundColor: "rgba(7,10,15,0.75)" }}>
          {chapterIcon && <img src={chapterIcon} alt="" width={256} height={256} />}
        </div>
        <div style={{ position: "absolute", left: 72, top: 630 - 52 - 32, display: "flex", alignItems: "center", gap: 12 }}>
          {star && <img src={star} alt="" width={32} height={32} />}
          <div style={{ fontFamily: "Title", fontSize: 20, letterSpacing: "0.12em", textTransform: "uppercase", color: C.soft }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    { ...CARD, fonts: await fonts() },
  );
}

/** A build's card: its cover, cropped at its focus as the hero is, darkened left and bottom, with what it is. */
export async function buildCard(b: {
  name: string;
  description: string;
  cover: string;
  focus?: { x: number; y: number };
  race: string;
  birthsign: string;
  mode: string;
  author: string;
  levels: number;
  version: string;
  video?: boolean;
}) {
  const [race, sign, mode] = await Promise.all([icon(`race-${slug(b.race)}`), b.birthsign ? icon(`sign-${slug(b.birthsign)}`) : null, icon(`mode-${slug(b.mode)}`)]);
  const facts: [string | null, string][] = [
    [race, b.race],
    ...(b.birthsign ? [[sign, `The ${b.birthsign}`] as [string | null, string]] : []),
    [mode, b.mode],
  ];
  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", backgroundColor: C.ground, color: C.text, fontFamily: "Body" }}>
        <img src={b.cover} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover", objectPosition: `${b.focus?.x ?? 50}% ${b.focus?.y ?? 50}%` }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(14,19,25,0.94) 0%, rgba(14,19,25,0.82) 38%, rgba(14,19,25,0.15) 72%, rgba(14,19,25,0) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(0deg, rgba(14,19,25,0.7) 0%, rgba(14,19,25,0) 40%)" }} />
        <Corners />
        <div style={{ position: "absolute", top: 56, left: 64, display: "flex", alignItems: "center", gap: 12 }}>
          <StarMark size={24} stroke={1.4} />
          <div style={{ fontFamily: "Title", fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase" }}>{SITE_NAME}</div>
        </div>
        <div style={{ position: "absolute", left: 64, bottom: 64, width: 640, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontFamily: "Title", fontSize: 86, lineHeight: 0.9, letterSpacing: "0.03em", textTransform: "uppercase" }}>{clampText(b.name, 22, 2)}</div>
          {b.description && <div style={{ fontFamily: "Flavor", fontStyle: "italic", fontSize: 28, lineHeight: 1.3, color: C.soft }}>{clampText(b.description, 44, 2)}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 22px", fontSize: 22 }}>
            {facts.map(([src, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {src && <img src={src} width={32} height={32} alt="" />}
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 19, color: C.muted }}>
            <div style={{ color: C.text }}>{b.author}</div>
            <div>{`Levels 1 to ${b.levels}`}</div>
            <div style={{ border: `1px solid ${C.ruleStrong}`, padding: "2px 10px", fontSize: 16, letterSpacing: "0.06em", color: C.soft }}>{`LoreRim ${b.version}`}</div>
          </div>
        </div>
        {b.video && <VideoBadge />}
      </div>
    ),
    { ...CARD, fonts: await fonts() },
  );
}
