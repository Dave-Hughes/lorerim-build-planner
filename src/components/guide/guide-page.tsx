"use client";

import { useCallback, useEffect, useState } from "react";
import { EditBar } from "@/components/editor/edit-bar";
import type { BuildVisibility } from "@/lib/builds/validate";
import { GUIDE_LIMITS, textLength, type GuideDoc } from "@/lib/guide/doc";
import type { BuildPlan } from "@/lib/rules/types";
import { GuideFactsProvider } from "./guide-facts";
import { GuideEditor, guideSaveLabel } from "./guide-editor";
import { saveKeptGuides } from "./use-guide-autosave";
import type { GuideSaveStatus } from "./use-guide-autosave";
import styles from "./guide-page.module.css";

/** The owner's page for the build's overall guide. */
export function GuidePage({ buildId, name, visibility, plan, initial, intro }: { buildId: string; name: string; visibility: BuildVisibility; plan: BuildPlan; initial: GuideDoc; intro: GuideDoc }) {
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null; retry: () => void }>({ status: "idle", error: null, retry: () => {} });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null, retry: () => void) => setSave({ status, error, retry }), []);
  const label = guideSaveLabel(save.status, save.error);
  useEffect(() => saveKeptGuides(buildId), [buildId]);
  // Which field has focus, so the miniature can show where it lands on the build page.
  const [focus, setFocus] = useState<"intro" | "guide" | null>(null);
  return (
    <>
      <EditBar
        snapshot={!!plan.snapshot}
        buildId={buildId}
        name={name}
        current="guide"
        visibility={visibility}
        status={
          label && (
            <span className={save.status === "failed" ? styles.failed : undefined}>
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
      />
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>Guide</h1>
        <div className={styles.columns}>
          <div className={styles.fields}>
            <GuideFactsProvider plan={plan}>
              <div onFocus={() => setFocus("intro")} onBlur={() => setFocus(null)}>
                <IntroField buildId={buildId} initial={intro} />
              </div>
              <section aria-label="Guide" className={styles.guideField} onFocus={() => setFocus("guide")} onBlur={() => setFocus(null)}>
                <span className="label">Guide</span>
                <GuideEditor buildId={buildId} sectionKey="overview" initial={initial} label="Guide" onStatus={onStatus} />
              </section>
            </GuideFactsProvider>
          </div>
          <Miniature buildId={buildId} focus={focus} />
        </div>
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

/**
 * A miniature of the shared build page in plain blocks, showing where each field lands: the field
 * with focus is lit in ember (both softly when neither has it). Level notes are written in the editor.
 */
function Miniature({ buildId, focus }: { buildId: string; focus: "intro" | "guide" | null }) {
  const lit = (f: "intro" | "guide") => (focus === f ? styles.miniOn : focus === null ? styles.miniSoft : "");
  return (
    <aside aria-label="Where it shows" className={styles.mini}>
      <div className={styles.miniPage}>
        <div className={styles.miniHero} />
        <div className={`${styles.miniBlock} ${styles.miniIntro} ${lit("intro")}`} data-mini="intro">
          <span className={styles.miniLabel}>Intro</span>
          <i />
          <i />
        </div>
        <div className={styles.miniAbout} />
        <div className={styles.miniTabs}>
          <span className={styles.miniTabOn}>Levels</span>
          <span className={`${styles.miniTab} ${lit("guide")}`} data-mini="guide">
            Guide
          </span>
        </div>
        <div className={styles.miniCard}>
          <div className={styles.miniRows}>
            <i />
            <i />
            <i />
          </div>
          <a href={`/b/${buildId}/edit?level=1`} className={styles.miniNote}>
            Level notes
          </a>
        </div>
      </div>
      <a href={`/b/${buildId}?tab=guide`} target="_blank" rel="noopener" className={styles.miniLink}>
        See it on the build page
      </a>
    </aside>
  );
}
