"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import type { GuideDoc } from "@/lib/guide/doc";
import type { BuildPlan } from "@/lib/rules/types";
import { GuideFactsProvider } from "./guide-facts";
import { GuideEditor, guideSaveLabel } from "./guide-editor";
import type { GuideSaveStatus } from "./use-guide-autosave";
import styles from "./guide-page.module.css";

export const GUIDE_PLACEHOLDER = "[Write the guide: how to play this build, what to prioritise, where to go]";

/** The owner's page for the build's overall guide. */
export function GuidePage({ buildId, name, plan, initial }: { buildId: string; name: string; plan: BuildPlan; initial: GuideDoc }) {
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null; retry: () => void }>({ status: "idle", error: null, retry: () => {} });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null, retry: () => void) => setSave({ status, error, retry }), []);
  const label = guideSaveLabel(save.status, save.error);
  return (
    <>
      <FocusHeader
        context={`Guide for ${name}`}
        status={
          label && (
            <span role="status" className={save.status === "failed" ? styles.failed : undefined}>
              {label}
              {save.status === "failed" && !save.error?.startsWith("Too long") && (
                <>
                  {" "}
                  <button type="button" className={styles.linkButton} onClick={save.retry}>
                    Try again
                  </button>
                </>
              )}
            </span>
          )
        }
        actions={
          <>
            <Link href={`/b/${buildId}/edit`} className="btn btn-sm">
              Levels
            </Link>
            <Link href={`/b/${buildId}`} className="btn btn-sm">
              See it as a visitor
            </Link>
          </>
        }
      />
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>{name}</h1>
        <GuideFactsProvider plan={plan}>
          <GuideEditor buildId={buildId} sectionKey="overview" initial={initial} label="Guide" placeholder={GUIDE_PLACEHOLDER} onStatus={onStatus} />
        </GuideFactsProvider>
      </main>
    </>
  );
}
