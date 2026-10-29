import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RunStoryEdit } from "@/components/playthrough/story-edit";
import { buildOfRun } from "@/lib/playthroughs/queries";

export const metadata: Metadata = { title: "Editing the story" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

/** The Story tab in edit mode (WO-117): it opens on the title page; under its character (WO-179 Part 2). */
export default async function EditStoryPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const p = new URLSearchParams(Object.entries(query).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));
  const bid = await buildOfRun(id);
  if (bid) redirect(`/b/${bid}/edit/story/title${p.size ? `?${p}` : ""}`);
  return RunStoryEdit({ id, page: null });
}
