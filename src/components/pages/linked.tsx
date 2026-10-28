import { PreviewLink } from "./preview-link";
import { linkNames, type NameLink } from "@/lib/pages/link-names";
import styles from "./page-kit.module.css";

/** Text with the people and places it names as links to their pages (WO-154). */
export function Linked({ text, names, skip }: { text: string; names: NameLink[]; skip?: string }) {
  return (
    <>
      {linkNames(text, names, skip).map((p, i) =>
        p.href && p.external ? (
          <a key={i} href={p.href} target="_blank" rel="noreferrer">
            {p.text} <span aria-hidden="true">↗</span>
          </a>
        ) : p.href ? (
          <PreviewLink key={i} href={p.href} className={p.href.startsWith("/places/") ? styles.placeLink : undefined}>
            {p.text}
          </PreviewLink>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
