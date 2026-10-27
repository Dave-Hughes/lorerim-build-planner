import { notFound } from "next/navigation";
import { questsOn } from "@/lib/features";

/** The people and places pages (WO-154) ride the Quests switch: on in dev and on staging, off on production unless FEATURE_QUESTS says so. */
export default function Layout({ children }: { children: React.ReactNode }) {
  if (!questsOn()) notFound();
  return children;
}
