import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

/** The Story is retired (WO-181), a build's held-back one too: its editor goes to the Playthrough tab in edit mode. */
export default async function StoryEditPage({ params }: { params: Params }) {
  redirect(`/b/${(await params).id}/edit/play`);
}
