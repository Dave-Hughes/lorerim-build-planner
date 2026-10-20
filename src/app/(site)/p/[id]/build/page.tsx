import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

/** The Build tab is gone (WO-116): the build is the character page's Levels tab. */
export default async function RunBuildPage({ params }: { params: Params }) {
  redirect(`/p/${(await params).id}?tab=levels`);
}
