import { notFound } from "next/navigation";
import { siteGuideOn } from "@/lib/features";

/** The site's beginner's guide, held back for launch (WO-81): every /guide route is not found while it's off. */
export default function GuideLayout({ children }: { children: React.ReactNode }) {
  if (!siteGuideOn()) notFound();
  return children;
}
