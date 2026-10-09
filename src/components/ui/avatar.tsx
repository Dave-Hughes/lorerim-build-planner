import Image from "next/image";
import styles from "./avatar.module.css";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, image, size = 28 }: { name: string; image: string | null; size?: number }) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size, fontSize: Math.round(size * 0.43) }} aria-hidden="true">
      {image ? <Image src={image} alt="" width={size} height={size} /> : initials(name)}
    </span>
  );
}
