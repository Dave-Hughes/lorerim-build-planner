import { auth } from "@/auth";
import { SignInButton } from "@/components/site-header";
import { confirmationsOf } from "@/lib/quests/confirmations";
import { pageShots } from "@/lib/screenshots/view";
import { knowFor } from "@/lib/tips/view";
import { ViewBeacon } from "./view-beacon";
import { YouConfirmed } from "./you-confirmed";
import type { KnowProps } from "./page-kit";
import styles from "./page-kit.module.css";

/**
 * What a quest, person or place page adds to its Information Confidence (WO-184): who confirmed it (with "You confirmed this on … Undo" for the reader),
 * "I know this" on each Not sure yet line, the screenshots a mistake can be reported on, and a view counted. One look per page.
 */
export async function pageExtras(kind: "quest" | "person" | "place", key: string, path: string, signInTo = path) {
  const userId = (await auth())?.user?.id ?? null;
  const [confirmed, know, shots] = await Promise.all([confirmationsOf(kind, key, userId), knowFor(kind, key), kind === "quest" ? Promise.resolve(null) : pageShots(kind, key)]);
  const signIn = <SignInButton redirectTo={`${signInTo}#sure`} className={styles.linkBtn} label="Sign in to tell us" />;
  const names = [
    ...(confirmed.mineAt ? [<YouConfirmed key="you" kind={kind} id={key} path={path} at={confirmed.mineAt} />] : []),
    ...confirmed.others.map((n, i) => <span key={`${n}-${i}`}>{n}</span>),
  ];
  const props: KnowProps = { kind, key, signedIn: !!userId, sent: know.sent, answered: know.answered, signIn };
  // The screenshots a reader could say aren't the page: live ones, not the reader's own.
  const reportable = (shots?.shots ?? []).filter((s) => s.status === "live" && !s.mine).map((s) => ({ id: s.id, thumbUrl: s.thumbUrl }));
  return { userId, confirmed, names, know: props, reportable, beacon: <ViewBeacon kind={kind} id={key} /> };
}
