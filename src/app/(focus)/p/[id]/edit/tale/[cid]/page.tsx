import { redirect } from "next/navigation";

type Params = Promise<{ id: string; cid: string }>;

/** The chapter's old edit address (WO-111) goes to the Story tab at that chapter (WO-117). */
export default async function OldChapterEditPage({ params }: { params: Params }) {
  const { id, cid } = await params;
  redirect(`/p/${id}/edit/story/${cid}`);
}
