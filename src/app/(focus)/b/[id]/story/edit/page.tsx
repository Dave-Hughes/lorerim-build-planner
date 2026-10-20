import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

/** The build's old Story editor address (WO-116) goes to the Story tab in edit mode (WO-117). */
export default async function OldStoryEditPage({ params }: { params: Params }) {
  redirect(`/b/${(await params).id}/edit/story`);
}
