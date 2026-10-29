import { redirect } from "next/navigation";
import { buildOfRun } from "@/lib/playthroughs/queries";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string; tale?: string }>;

/** The run's old edit address (WO-111) goes to its tab (WO-117): Play, or Story for ?tale=1; under its character (WO-179 Part 2). */
export default async function OldEditPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { act, tale }] = await Promise.all([params, searchParams]);
  const bid = await buildOfRun(id);
  const base = bid ? `/b/${bid}/edit` : `/p/${id}/edit`;
  if (tale === "1") redirect(`${base}/story/title`);
  redirect(`${base}/play${act ? `?act=${encodeURIComponent(act)}` : ""}`);
}
