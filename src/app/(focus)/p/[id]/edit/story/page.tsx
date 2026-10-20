import type { Metadata } from "next";
import { RunEdit } from "@/components/playthrough/run-edit";

export const metadata: Metadata = { title: "Editing the story" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** The Story tab in edit mode (WO-117): every chapter, entry and beat, each opening in the Story editor. */
export default async function EditStoryPage({ params }: { params: Params }) {
  return RunEdit({ id: (await params).id, tale: true });
}
