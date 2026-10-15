import type { Metadata } from "next";
import { SignInButton } from "@/components/site-header";
import styles from "./signin.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

/**
 * Sign in behind the coming soon page (WO-84): one button, linked from nowhere, so Dave can sign in on
 * production. Back to / after.
 */
export default function SignInPage() {
  return (
    <main className={styles.main}>
      <SignInButton redirectTo="/" className="btn btn-primary" label="Sign in with Discord" />
    </main>
  );
}
