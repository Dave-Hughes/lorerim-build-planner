import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Editor } from "@/components/editor/editor";
import { getBuild } from "@/lib/builds/queries";

type Params = Promise<{ id: string }>;
type Search = Promise<{ level?: string }>;

export const metadata: Metadata = { title: "Edit build" };
export const dynamic = "force-dynamic";

export default async function EditPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { level }, session] = await Promise.all([params, searchParams, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  return <Editor buildId={id} name={build.name} initialPlan={build.plan} initialLevel={Number(level) || 0} />;
}
