import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

/** Gear is set level by level in the editor now; old links to the Gear page go there. */
export default async function GearPage({ params }: { params: Params }) {
  const { id } = await params;
  redirect(`/b/${id}/edit`);
}
