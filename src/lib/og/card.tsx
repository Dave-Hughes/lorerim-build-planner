/**
 * The link-preview cards (WO-33), 1200×630, drawn by next/og's ImageResponse to the canvas
 * artboards "ShareBuild" and "ShareSite". Server only: it reads the fonts and icons from disk.
 */
/* eslint-disable @next/next/no-img-element -- ImageResponse draws these to a PNG; next/image doesn't apply. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { CARD, SITE_LINE, SITE_NAME } from "./metadata";

const ROOT = process.cwd();
const C = { ground: "#0e1319", text: "#e4ebf0", soft: "#c3cdd6", muted: "#8e9bab", brass: "#b9a173", ember: "#f0913f", rule: "#2a3442", ruleStrong: "#3a4658" };

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

/** The site's card: the mark, the name (or a build's name, for a build with no cover), the line, the version, the 18 skills. */
export async function siteCard({ title = SITE_NAME, version, skills, video = false }: { title?: string; version: string; skills: string[]; video?: boolean }) {
  const icons = await Promise.all(skills.map((s) => icon(slug(s))));
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: C.ground,
          backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 18px)",
          color: C.text,
          fontFamily: "Body",
        }}
      >
        <Corners />
        <div style={{ position: "absolute", left: 72, top: 0, bottom: 0, width: 560, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
          <StarMark size={64} stroke={1} />
          <div style={{ fontFamily: "Title", fontSize: title === SITE_NAME ? 96 : 80, lineHeight: 0.9, letterSpacing: "0.06em", textTransform: "uppercase" }}>{clampText(title, 16, 3)}</div>
          <div style={{ fontFamily: "Flavor", fontStyle: "italic", fontSize: 32, lineHeight: 1.3, color: C.soft }}>{SITE_LINE}</div>
          <div style={{ display: "flex" }}>
            <div style={{ border: `1px solid ${C.ruleStrong}`, padding: "3px 12px", fontSize: 18, letterSpacing: "0.06em", color: C.soft }}>{`LoreRim ${version}`}</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 135,
            // Six across: 6 icons of 48, 5 gaps of 22, 30 padding each side, the 1px border.
            width: 460,
            display: "flex",
            flexWrap: "wrap",
            gap: 22,
            padding: 30,
            border: `1px solid ${C.rule}`,
            background: "rgba(18,25,34,0.8)",
          }}
        >
          {icons.map((src, i) => (src ? <img key={i} src={src} width={48} height={48} style={{ opacity: 0.9 }} alt="" /> : <div key={i} style={{ width: 48, height: 48 }} />))}
        </div>
        {video && <VideoBadge />}
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
