import { useId } from "react";
import { RaceIcon, SignIcon, SkillIcon } from "@/components/ui/skill-icon";
import type { MentionInfo } from "@/lib/guide/mention";
import styles from "./mention.module.css";

export function MentionChipIcon({ info }: { info: MentionInfo }) {
  const i = info.icon;
  if (i.type === "trait")
    // eslint-disable-next-line @next/next/no-img-element
    return i.image ? <img src={i.image} alt="" aria-hidden="true" width={16} height={16} className={styles.traitIcon} /> : null;
  if (i.type === "none") return null;
  if (i.type === "sign") return <SignIcon name={i.name} />;
  if (i.type === "race") return <RaceIcon name={i.name} />;
  return <SkillIcon name={i.name} />;
}

/**
 * A mentioned game thing: its icon and name. Hover, focus or tap shows the game's own text
 * and, for perks, where this build takes it. A thing this version doesn't have shows as
 * plain text with a dotted underline.
 */
export function MentionChip({
  info,
  missingLabel,
  version,
  takenAt,
}: {
  info: MentionInfo | null;
  /** Shown when `info` is null. */
  missingLabel: string;
  version: string;
  /** Levels the build takes this perk at; null when it isn't a perk or the build isn't known. */
  takenAt?: number[] | null;
}) {
  const id = useId();
  if (!info) {
    return (
      <span className={styles.wrap}>
        <button type="button" className={styles.missing} aria-describedby={id}>
          {missingLabel}
        </button>
        <span role="tooltip" id={id} className={styles.tooltip}>
          Not in LoreRim {version}
        </span>
      </span>
    );
  }
  const where = takenAt === undefined || takenAt === null ? null : takenAt.length ? `Taken at level ${takenAt.join(", ")}` : "Not taken in this build";
  return (
    <span className={styles.wrap}>
      <button type="button" className={styles.chip} aria-describedby={id} data-kind={info.kind}>
        <MentionChipIcon info={info} />
        <span>{info.name}</span>
      </button>
      <span role="tooltip" id={id} className={styles.tooltip}>
        <span className={styles.kind}>{info.kindLabel}</span>
        {info.text && <span className={styles.text}>{info.text}</span>}
        {where && <span className={styles.where}>{where}</span>}
      </span>
    </span>
  );
}
