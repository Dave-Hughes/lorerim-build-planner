import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { GearPage } from "@/components/editor/gear-page";
import { GameDataProvider } from "@/components/game-data";
import { getBuild } from "@/lib/builds/queries";
import { clientVersion, isKnownVersion } from "@/lib/rules/server";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Gear" };
export const dynamic = "force-dynamic";

export default async function GearEditPage({ params }: { params: Params }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  const build = await getBuild(id, userId);
  if (!build) notFound();
  if (build.isSample || build.ownerId !== userId) redirect(`/b/${id}`);
  if (!isKnownVersion(build.gameVersion)) redirect(`/b/${id}`);
  return (
    <GameDataProvider version={build.gameVersion} serverVersion={clientVersion(build.gameVersion)}>
      <GearPage buildId={id} name={build.name} initialPlan={build.plan} />
    </GameDataProvider>
  );
}
