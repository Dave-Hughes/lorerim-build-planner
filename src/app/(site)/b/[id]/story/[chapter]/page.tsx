import { redirect } from "next/navigation";

type Params = Promise<{ id: string; chapter: string }>;

/** The Story is retired (WO-181): a chapter's old address goes to the character's Playthrough tab. */
export default async function ChapterPage({ params }: { params: Params }) {
  redirect(`/b/${(await params).id}?tab=playthrough`);
}
