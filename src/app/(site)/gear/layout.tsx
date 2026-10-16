import { notFound } from "next/navigation";
import { gearOn } from "@/lib/features";

/** The Gear page (WO-92), held back for its own announcement: /gear and every item page are not found while it's off. */
export default function GearLayout({ children }: { children: React.ReactNode }) {
  if (!gearOn()) notFound();
  return children;
}
