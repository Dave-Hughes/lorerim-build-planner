import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storyOn } from "@/lib/features";
import BuildPage, { generateMetadata as buildMetadata } from "../page";

type Params = Promise<{ id: string }>;

export const generateMetadata = ({ params }: { params: Params }): Promise<Metadata> => buildMetadata({ params });

/** A build's Story in the reader (WO-116): the build's page with the reader open on it. Held back with the Story (WO-81). */
export default async function BuildStoryPage({ params, searchParams }: { params: Params; searchParams: Promise<Record<string, string | undefined>> }) {
  if (!storyOn()) notFound();
  return BuildPage({ params, searchParams });
}
