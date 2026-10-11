"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import { GUIDE_LIMITS, textLength, type GuideDoc } from "@/lib/guide/doc";
import type { BuildPlan } from "@/lib/rules/types";
import { GuideFactsProvider } from "./guide-facts";
import { GuideEditor, guideSaveLabel } from "./guide-editor";
import { saveKeptGuides } from "./use-guide-autosave";
import type { GuideSaveStatus } from "./use-guide-autosave";
import styles from "./guide-page.module.css";

/** The owner's page for the build's overall guide. */
export function GuidePage({ buildId, name, plan, initial, intro }: { buildId: string; name: string; plan: BuildPlan; initial: GuideDoc; intro: GuideDoc }) {
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null; retry: () => void }>({ status: "idle", error: null, retry: () => {} });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null, retry: () => void) => setSave({ status, error, retry }), []);
  const label = guideSaveLabel(save.status, save.error);
  useEffect(() => saveKeptGuides(buildId), [buildId]);
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
            <Link href={`/b/${buildId}/gear`} className="btn btn-sm">
              Gear
            </Link>
            <Link href={`/b/${buildId}`} className="btn btn-sm">
              See it as a visitor
            </Link>
          </>
        }
      />
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>Guide</h1>
        <GuideFactsProvider plan={plan}>
          <IntroField buildId={buildId} initial={intro} />
          <GuideEditor buildId={buildId} sectionKey="overview" initial={initial} label="Guide" onStatus={onStatus} />
        </GuideFactsProvider>
      </main>
    </>
  );
}

/** The short intro shown at the top of the shared page: bold, italic and links, 1,200 characters. */
function IntroField({ buildId, initial }: { buildId: string; initial: GuideDoc }) {
  const [length, setLength] = useState(() => textLength(initial));
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null }>({ status: "idle", error: null });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null) => setSave({ status, error }), []);
  const label = guideSaveLabel(save.status, save.error);
  const over = length > GUIDE_LIMITS.intro;
  return (
    <section aria-label="Intro" className={styles.intro}>
      <div className={styles.introHead}>
        <span className="label">Intro</span>
        <span className={over ? styles.failed : styles.count}>
          {length.toLocaleString("en-GB")} / {GUIDE_LIMITS.intro.toLocaleString("en-GB")}
        </span>
        {label && (
          <span role="status" className={save.status === "failed" ? styles.failed : styles.count}>
            {label}
          </span>
        )}
      </div>
      <GuideEditor buildId={buildId} sectionKey="intro" initial={initial} label="Intro" inline onStatus={onStatus} onChange={(doc) => setLength(textLength(doc))} />
    </section>
  );
}
