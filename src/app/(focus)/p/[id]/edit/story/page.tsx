import type { Metadata } from "next";
import { RunStoryEdit } from "@/components/playthrough/story-edit";

export const metadata: Metadata = { title: "Editing the story" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** The Story tab in edit mode (WO-117): it opens on the title page. */
export default async function EditStoryPage({ params }: { params: Params }) {
  return RunStoryEdit({ id: (await params).id, page: null });
}
