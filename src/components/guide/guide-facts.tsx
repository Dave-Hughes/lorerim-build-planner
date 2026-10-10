"use client";

import { createContext, useContext, useMemo } from "react";
import { useGameData } from "@/components/game-data";
import { mentionFallbackLabel, resolveMention } from "@/lib/guide/mention";
import type { GameData } from "@/lib/rules/data";
import { computeBuild } from "@/lib/rules/engine";
import type { BuildPlan, LevelState } from "@/lib/rules/types";
import { MentionChip } from "./mention-chip";

/** What @-mention chips need: the build's version data and where the build takes each perk. */
export interface GuideFacts {
  d: GameData;
  takenAt: (kind: string, id: string) => number[] | null;
}

const GuideFactsContext = createContext<GuideFacts | null>(null);

/** Under a GameDataProvider for the build's version. Pass `states` when they are already worked out. */
export function GuideFactsProvider({ plan, states, children }: { plan: BuildPlan; states?: LevelState[]; children: React.ReactNode }) {
  const d = useGameData();
  const worked = useMemo(() => states ?? computeBuild(plan, d), [states, plan, d]);
  const facts = useMemo<GuideFacts>(() => {
    const last = worked[worked.length - 1];
    return {
      d,
      takenAt: (kind, id) => {
        if (!last) return null;
        if (kind === "perk") return last.perksTaken[id] ?? [];
        if (kind === "destiny") return id in last.destinyTaken ? [last.destinyTaken[id]] : [];
        return null;
      },
    };
  }, [d, worked]);
  return <GuideFactsContext.Provider value={facts}>{children}</GuideFactsContext.Provider>;
}

/** A mention as drawn in the guide: a chip, or plain text when nothing tells us what it is. */
export function GuideMention({ kind, id }: { kind: string; id: string }) {
  const facts = useContext(GuideFactsContext);
  if (!facts) return <>{mentionFallbackLabel(id)}</>;
  return <MentionChip info={resolveMention(facts.d, kind, id)} missingLabel={mentionFallbackLabel(id)} version={facts.d.version.id} takenAt={facts.takenAt(kind, id)} />;
}
