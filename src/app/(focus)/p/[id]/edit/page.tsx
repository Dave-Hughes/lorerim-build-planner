import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string; tale?: string }>;

/** The run's old edit address (WO-111) goes to its tab (WO-117): Play, or Story for ?tale=1. */
export default async function OldEditPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { act, tale }] = await Promise.all([params, searchParams]);
  if (tale === "1") redirect(`/p/${id}/edit/story/title`);
  redirect(`/p/${id}/edit/play${act ? `?act=${encodeURIComponent(act)}` : ""}`);
}
