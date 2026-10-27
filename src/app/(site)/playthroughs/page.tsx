import { notFound, redirect } from "next/navigation";
import { playthroughsOn } from "@/lib/features";

export const dynamic = "force-dynamic";

/** Playthroughs are on the Characters page now (WO-154 Part 5): the same address goes there with "Has a playthrough" on. */
export default function PlaythroughsPage() {
  if (!playthroughsOn()) notFound();
  redirect("/?run=1");
}
