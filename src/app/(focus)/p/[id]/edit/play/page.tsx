import type { Metadata } from "next";
import { RunEdit } from "@/components/playthrough/run-edit";

export const metadata: Metadata = { title: "Editing a playthrough" };
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type Search = Promise<{ act?: string }>;

/** The Play tab in edit mode (WO-117). */
export default async function EditPlayPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ id }, { act }] = await Promise.all([params, searchParams]);
  return RunEdit({ id, act });
}
