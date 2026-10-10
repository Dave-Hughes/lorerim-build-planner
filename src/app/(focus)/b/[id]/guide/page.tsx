import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GuidePage } from "@/components/guide/guide-page";
import { getBuild } from "@/lib/builds/queries";
import { emptyDoc } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Guide" };
export const dynamic = "force-dynamic";

export default async function GuideEditPage({ params }: { params: Params }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  const guide = await getGuide(id, build.plan);
  return <GuidePage buildId={id} name={build.name} initial={guide.overview?.doc ?? emptyDoc()} />;
}
