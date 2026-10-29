import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RunEdit } from "@/components/playthrough/run-edit";
import { buildOfRun } from "@/lib/playthroughs/queries";

export const metadata: Metadata = { title: "Editing a playthrough" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string }>;

/** The run's editor belongs to its character (WO-179 Part 2): /b/<character>/edit/play. A run from before characters, with none, is edited here still. */
export default async function EditPlayPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { act }] = await Promise.all([params, searchParams]);
  const bid = await buildOfRun(id);
  if (bid) redirect(`/b/${bid}/edit/play${act ? `?act=${encodeURIComponent(act)}` : ""}`);
  return RunEdit({ id, act });
}
