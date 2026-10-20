import type { Metadata } from "next";
import { RunStoryEdit } from "@/components/playthrough/story-edit";

export const metadata: Metadata = { title: "Editing the story" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string; cid: string }>;

/** A page of the Story in edit mode (WO-117): the title page, a chapter, or an act's chapter not written yet. */
export default async function EditStoryPagePage({ params }: { params: Params }) {
  const { id, cid } = await params;
  return RunStoryEdit({ id, page: cid });
}
