import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RunStoryEdit } from "@/components/playthrough/story-edit";
import { buildOfRun } from "@/lib/playthroughs/queries";

export const metadata: Metadata = { title: "Editing the story" };
export const dynamic = "force-dynamic";

/** The address's own query (?images=1 opens the Images panel) goes with it. */
const keep = (q: Record<string, string | string[] | undefined>) => {
  const p = new URLSearchParams(Object.entries(q).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));
  return p.size ? `?${p}` : "";
};

type Params = Promise<{ id: string; cid: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

/** A page of the Story in edit mode (WO-117): the title page, a chapter, or an act's chapter not written yet; under its character (WO-179 Part 2). */
export default async function EditStoryPagePage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id, cid }, query] = await Promise.all([params, searchParams]);
  const bid = await buildOfRun(id);
  if (bid) redirect(`/b/${bid}/edit/story/${cid}${keep(query)}`);
  return RunStoryEdit({ id, page: cid });
}
