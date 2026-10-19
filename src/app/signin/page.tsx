import type { Metadata } from "next";
import { SignInButton } from "@/components/site-header";
import styles from "./signin.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

type Search = Promise<{ next?: string }>;

/**
 * Sign in behind the coming soon page (WO-84): one button, so Dave can sign in on production. Back
 * to `next` after (an assistant's consent page, WO-109) when it's a path on this site, else to /.
 */
export default async function SignInPage({ searchParams }: { searchParams: Search }) {
  const { next } = await searchParams;
  const to = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return (
    <main className={styles.main}>
      <SignInButton redirectTo={to} className="btn btn-primary" label="Sign in with Discord" />
    </main>
  );
}
