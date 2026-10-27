import { notFound } from "next/navigation";
import { questsOn } from "@/lib/features";

/** Search (WO-154 Part 4) rides the Quests switch: on in dev and on staging, off on production unless FEATURE_QUESTS says so. */
export default function Layout({ children }: { children: React.ReactNode }) {
  if (!questsOn()) notFound();
  return children;
}
