import sample from "@/lib/rules/__fixtures__/sample-build.json";
import { readPlan } from "@/lib/rules/convert";
import type { BuildPlan } from "@/lib/rules/types";
import { SAMPLE_BUILD_ID } from "./ids";
import type { BuildRecord } from "./types";

/** The example build, served without a database so anyone can see one. */
export function sampleBuild(): BuildRecord {
  const { name, description, ...plan } = sample as unknown as BuildPlan & { name: string; description: string };
  return {
    id: SAMPLE_BUILD_ID,
    ownerId: "",
    name,
    description,
    coverImageUrl: null,
    writeupUrl: null,
    visibility: "public",
    gameVersion: plan.gameVersion,
    plan: readPlan(plan),
    createdAt: new Date("2026-10-09T00:00:00Z"),
    updatedAt: new Date("2026-10-09T00:00:00Z"),
    author: { name: "Example build", image: null, handle: null },
    tags: [],
    likeCount: 0,
    likedByViewer: false,
    isSample: true,
  };
}
