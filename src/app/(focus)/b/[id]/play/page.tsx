import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

/** The Playthrough tab's old address (WO-159): the editor is under the character now (WO-179 Part 2). */
export default async function PlaythroughTabPage({ params }: { params: Params }) {
  redirect(`/b/${(await params).id}/edit/play`);
}
