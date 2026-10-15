import styles from "./skill-icon.module.css";

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * A pixel icon from public/icons, drawn by scripts/icons/pixels.py. Decorative: the name always
 * sits beside it. `file` is the icon's file name without ".svg". 16px, 24px or 32px.
 */
export function GameIcon({ file, size = 16, className }: { file: string; size?: 16 | 24 | 32; className?: string }) {
  // A small SVG: nothing for next/image to optimise.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/${file}.svg`} width={size} height={size} alt="" aria-hidden="true" className={`${styles.icon} ${size === 32 ? styles.big : size === 24 ? styles.mid : ""} ${className ?? ""}`} />;
}

/** A skill tree or Destiny. */
export function SkillIcon({ name, size = 16 }: { name: string; size?: 16 | 24 | 32 }) {
  return <GameIcon file={slug(name)} size={size} />;
}

/** Health, Magicka or Stamina. */
export function AttributeIcon({ name, size = 16 }: { name: string; size?: 16 | 24 | 32 }) {
  return <GameIcon file={`attr-${slug(name)}`} size={size} />;
}

/** A birthsign or standing stone ("Lord" or "The Lord"); the stones share the signs' constellations. */
export function SignIcon({ name, size = 16, className }: { name: string; size?: 16 | 24 | 32; className?: string }) {
  return <GameIcon file={`sign-${slug(name)}`} size={size} className={className} />;
}

/** One of the ten races. */
export function RaceIcon({ name, size = 16, className }: { name: string; size?: 16 | 24 | 32; className?: string }) {
  return <GameIcon file={`race-${slug(name)}`} size={size} className={className} />;
}

/**
 * A deity (WO-34). Its file keeps a leading "the" (deity-the-hoonding), unlike the other icons' slug.
 */
export function deityIconFile(name: string): string {
  return `deity-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}
export function DeityIcon({ name, size = 16 }: { name: string; size?: 16 | 24 | 32 }) {
  return <GameIcon file={deityIconFile(name)} size={size} />;
}

/** A level marker (WO-30): trainer, skill book, banked points, perk points, a note. */
export function MarkIcon({ name, size = 16 }: { name: "trainer" | "skill-book" | "banked" | "perk-points" | "note" | "power" | "shout"; size?: 16 | 24 | 32 }) {
  return <GameIcon file={`mark-${name}`} size={size} />;
}

/** A gear slot (WO-22's ten: Main hand ... Other). */
export function SlotIcon({ slot, size = 16 }: { slot: string; size?: 16 | 24 | 32 }) {
  return <GameIcon file={`slot-${SLOT_ICON[slot] ?? "other"}`} size={size} />;
}

/** The gear types' icons (WO-82): the old slots keep theirs; the rest share the nearest, or Other's. */
const SLOT_ICON: Record<string, string> = {
  "Main hand": "main-hand",
  "Off hand": "off-hand",
  Shield: "off-hand",
  Ammo: "ammo",
  Head: "head",
  Circlet: "head",
  Face: "head",
  Body: "body",
  Hands: "hands",
  Feet: "feet",
  Ring: "ring",
  Earrings: "ring",
  Amulet: "amulet",
  Necklace: "amulet",
};

/** A game mode: Konahrik's mask, Naaktiid's seedling. */
export function ModeIcon({ mode, size = 16 }: { mode: string; size?: 16 | 24 | 32 }) {
  return <GameIcon file={`mode-${slug(mode)}`} size={size} />;
}

/** Tags that are a skill reuse its icon; the seven without one have their own (tag-*.svg). */
const TAG_SKILL_ICON: Record<string, string> = {
  "one-handed": "one-handed",
  "two-handed": "two-handed",
  marksman: "marksman",
  "heavy-armor": "heavy-armor",
  destruction: "destruction",
  conjuration: "conjuration",
  illusion: "illusion",
  alteration: "alteration",
  restoration: "restoration",
  "light-armor": "evasion",
  stealth: "sneak",
  thief: "finesse",
  crafter: "smithing",
};

/** A build tag, by its slug. */
export function TagIcon({ tag, size = 16 }: { tag: string; size?: 16 | 24 | 32 }) {
  return <GameIcon file={TAG_SKILL_ICON[tag] ?? `tag-${tag}`} size={size} />;
}

/** An icon, then its text, centred on one line with a 7px gap. */
export function IconLabel({ icon, className, children }: { icon: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <span className={`${styles.label} ${className ?? ""}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
}

/** A skill tree's icon, then its name (or `children` when the line says more). */
export function SkillLabel({ name, className, children }: { name: string; className?: string; children?: React.ReactNode }) {
  return (
    <IconLabel icon={<SkillIcon name={name} />} className={className}>
      {children ?? <NoBreakHyphens text={name} />}
    </IconLabel>
  );
}

/**
 * Text whose hyphenated words never break at the hyphen ("One-Handed", never "One-/Handed", WO-73);
 * it still wraps at its spaces. The text itself is unchanged.
 */
export function NoBreakHyphens({ text }: { text: string }) {
  return text.split(/(\S*-\S*)/).map((part, i) => (/-/.test(part) ? <span key={i} style={{ whiteSpace: "nowrap" }}>{part}</span> : part));
}
