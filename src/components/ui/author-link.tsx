import Link from "next/link";
import type { BuildAuthor } from "@/lib/builds/types";
import styles from "./author-link.module.css";

/**
 * A build's author: avatar and name, linking to their page (/u/<handle>) once they have a handle.
 * The avatar is passed in so each place keeps its own size and look.
 */
export function AuthorLink({ author, avatar, className, nameClassName }: { author: BuildAuthor; avatar: React.ReactNode; className?: string; nameClassName?: string }) {
  const inner = (
    <>
      {avatar}
      <span className={nameClassName}>{author.name}</span>
    </>
  );
  return author.handle ? (
    <Link href={`/u/${author.handle}`} className={`${className ?? ""} ${styles.link}`}>
      {inner}
    </Link>
  ) : (
    <span className={className}>{inner}</span>
  );
}
