import { redirect } from "next/navigation";
import { buildOfRun } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string; cid: string }>;

/** The chapter's old edit address (WO-111) goes to the Story tab at that chapter (WO-117), under its character (WO-179 Part 2). */
export default async function OldChapterEditPage({ params }: { params: Params }) {
  const { id, cid } = await params;
  const bid = await buildOfRun(id);
  redirect(bid ? `/b/${bid}/edit/story/${cid}` : `/p/${id}/edit/story/${cid}`);
}
