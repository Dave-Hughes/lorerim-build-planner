import { notFound, permanentRedirect } from "next/navigation";
import { storyById } from "@/lib/quests/stories-data";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/** A story's old address (WO-106): every line has one page now (WO-160), the story told on it. */
export default async function StoryPage({ params }: { params: Params }) {
  const story = storyById((await params).id);
  if (!story) notFound();
  permanentRedirect(`/quests/${story.line}`);
}
