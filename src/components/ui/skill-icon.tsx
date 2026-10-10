import styles from "./skill-icon.module.css";

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Pixel icon for a skill tree or Destiny, drawn by scripts/icons/pixels.py. Decorative: the name always sits beside it. */
export function SkillIcon({ name, size = 16 }: { name: string; size?: number }) {
  // A 16px SVG: nothing for next/image to optimise.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/${slug(name)}.svg`} width={size} height={size} alt="" aria-hidden="true" className={styles.icon} />;
}
