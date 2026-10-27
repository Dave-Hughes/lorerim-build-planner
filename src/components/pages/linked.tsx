import { PreviewLink } from "./preview-link";
import { linkNames, type NameLink } from "@/lib/pages/link-names";

/** Text with the people and places it names as links to their pages (WO-154). */
export function Linked({ text, names }: { text: string; names: NameLink[] }) {
  return (
    <>
      {linkNames(text, names).map((p, i) =>
        p.href && p.external ? (
          <a key={i} href={p.href} target="_blank" rel="noreferrer">
            {p.text} <span aria-hidden="true">↗</span>
          </a>
        ) : p.href ? (
          <PreviewLink key={i} href={p.href}>
            {p.text}
          </PreviewLink>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
