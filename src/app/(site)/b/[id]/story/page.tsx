import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

/** The Story is retired (WO-181): its address goes to the character's page. */
export default async function BuildStoryPage({ params }: { params: Params }) {
  redirect(`/b/${(await params).id}?tab=playthrough`);
}
