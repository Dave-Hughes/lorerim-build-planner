import { GameIcon, SlotIcon } from "@/components/ui/skill-icon";
import { nexusUrl } from "@/lib/gear/data";
import type { GearKind } from "@/lib/gear/query";
import styles from "./gear.module.css";

/** An item's type icon: its gear type's for armor, the weapon hand's for weapons, the quiver's for ammo. */
export function GearTypeIcon({ kind, type, size = 16 }: { kind: GearKind; type: string | null; size?: 16 | 24 | 32 }) {
  return <SlotIcon slot={kind === "armor" ? (type ?? "Other") : kind === "weapon" ? "Main hand" : "Ammo"} size={size} />;
}

/** A plugin: a link to its Nexus page in a new tab, or plain text when it has none. */
export function PluginName({ plugin, className }: { plugin: string; className?: string }) {
  const url = nexusUrl(plugin);
  if (!url) return <span className={className}>{plugin}</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className={className}>
      {plugin} <span aria-hidden="true">↗</span>
    </a>
  );
}

/** Where it's made: the anvil and the station. */
export function Station({ name }: { name: string }) {
  return (
    <span className={styles.station}>
      <GameIcon file="smithing" />
      {name}
    </span>
  );
}

/** "350", "12.5": the game's numbers without trailing zeros. */
export const num = (n: number | undefined) => (n ? String(Math.round(n * 100) / 100) : "");
