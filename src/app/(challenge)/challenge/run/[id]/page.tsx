import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { challengeOn } from "@/lib/features";
import { deleteRun } from "@/lib/challenge/actions";
import { savedRun } from "@/lib/challenge/store";
import { isValidBuildId } from "@/lib/builds/ids";
import { RunSheet } from "@/components/challenge/run-sheet";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

const load = async (id: string) => (isValidBuildId(id) ? await savedRun(id).catch(() => null) : null);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const run = challengeOn() ? await load((await params).id) : null;
  return { title: run ? `${run.characterName} | Zenithar's Challenge` : "Zenithar's Challenge" };
}

/** One player's run. The owner also gets Remove. */
export default async function RunPage({ params }: { params: Params }) {
  if (!challengeOn()) notFound();
  const saved = await load((await params).id);
  if (!saved) notFound();
  const mine = (await auth().catch(() => null))?.user?.id === saved.userId;
  return (
    <RunSheet
      saved={saved}
      foot={
        mine ? (
          <form action={deleteRun}>
            <input type="hidden" name="id" value={saved.id} />
            <button type="submit" className="btn">
              Remove
            </button>
          </form>
        ) : null
      }
    />
  );
}
