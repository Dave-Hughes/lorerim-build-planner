import type { Metadata } from "next";
import BuildPage, { generateMetadata as buildMetadata } from "../page";

type Params = Promise<{ id: string }>;

export const generateMetadata = ({ params }: { params: Params }): Promise<Metadata> => buildMetadata({ params });

/** A build's Story in the reader (WO-116): the build's page with the reader open on it. */
export default async function BuildStoryPage({ params, searchParams }: { params: Params; searchParams: Promise<Record<string, string | undefined>> }) {
  return BuildPage({ params, searchParams });
}
