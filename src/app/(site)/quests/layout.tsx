import { notFound } from "next/navigation";
import { questsOn } from "@/lib/features";

/** The Quests pages (WO-100): on in dev and on staging, off on production unless FEATURE_QUESTS says so. */
export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  if (!questsOn()) notFound();
  return children;
}
