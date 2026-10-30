import { redirect } from "next/navigation";

type Params = Promise<{ id: string; cid: string }>;

/** The Story is retired (WO-181): its editor's pages go to the Playthrough tab in edit mode. */
export default async function EditStoryPagePage({ params }: { params: Params }) {
  redirect(`/b/${(await params).id}/edit/play`);
}
