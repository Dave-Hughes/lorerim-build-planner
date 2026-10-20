"use client";

import { useCallback, useEffect, useState } from "react";
import { EditBar } from "@/components/editor/edit-bar";
import type { BuildVisibility } from "@/lib/builds/validate";
import { GUIDE_LIMITS, STORY_IMAGES, STORY_IMAGE_ERROR, docText, isEmptyDoc, lineDoc, type GuideDoc } from "@/lib/guide/doc";
import type { BuildPlan } from "@/lib/rules/types";
import { GuideFactsProvider } from "./guide-facts";
import { GuideEditor, guideSaveLabel } from "./guide-editor";
import { saveKeptGuides, unsavedGuide, useGuideAutosave } from "./use-guide-autosave";
import type { GuideSaveStatus } from "./use-guide-autosave";
import styles from "./guide-page.module.css";

/**
 * The owner's page for the build's Story (WO-79): a title, an opening line, and the tale itself in the
 * Guide's editor, with at most 5 images. Once it has a title and text, readers open it in the reader from the build page (WO-116).
 */
export function StoryPage({ buildId, name, visibility, plan, initial, title, line }: { buildId: string; name: string; visibility: BuildVisibility; plan: BuildPlan; initial: GuideDoc; title: string; line: string }) {
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null; retry: () => void }>({ status: "idle", error: null, retry: () => {} });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null, retry: () => void) => setSave({ status, error, retry }), []);
  const label = guideSaveLabel(save.status, save.error);
  useEffect(() => saveKeptGuides(buildId), [buildId]);
  const [hasTitle, setHasTitle] = useState(!!title.trim());
  const [hasText, setHasText] = useState(!isEmptyDoc(initial));
  return (
    <>
      <EditBar
        buildId={buildId}
        name={name}
        current="story"
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
        <h1 className={`title ${styles.h1}`}>Story</h1>
        <p className={`muted ${styles.storyLead}`}>
          {hasTitle && hasText ? (
            <>
              Readers open it from the build page, in the reader.{" "}
              <a href={`/b/${buildId}/story`} target="_blank" rel="noopener">
                Read it there
              </a>
            </>
          ) : (
            "The character's tale, told your way. Readers can open it from the build page once it has a title and some text."
          )}
        </p>
        <div className={styles.fields}>
          <LineField buildId={buildId} sectionKey="story:title" label="Title" initial={title} max={GUIDE_LIMITS.storyTitle} required onText={(t) => setHasTitle(!!t.trim())} />
          <LineField buildId={buildId} sectionKey="story:line" label="Opening line" initial={line} max={GUIDE_LIMITS.storyLine} />
          <GuideFactsProvider plan={plan}>
            <section aria-label="Story" className={styles.guideField}>
              <span className="label">Story</span>
              <GuideEditor
                buildId={buildId}
                sectionKey="story"
                initial={initial}
                label="Story"
                onStatus={onStatus}
                onChange={(doc) => setHasText(!isEmptyDoc(doc))}
                maxImages={{ max: STORY_IMAGES, message: STORY_IMAGE_ERROR }}
              />
            </section>
          </GuideFactsProvider>
        </div>
      </main>
    </>
  );
}

/** One line of plain text, saved as it's typed: the Story's title or opening line. */
function LineField({ buildId, sectionKey, label, initial, max, required, onText }: { buildId: string; sectionKey: string; label: string; initial: string; max: number; required?: boolean; onText?: (text: string) => void }) {
  const { status, error, change } = useGuideAutosave(buildId, sectionKey);
  // Typed here before and never saved: that text, which the save below sends again.
  const [value, setValue] = useState(() => docText(unsavedGuide(buildId, sectionKey)) || initial);
  useEffect(() => {
    if (value !== initial) change(lineDoc(value));
    // Only once, for text kept in this browser.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saved = guideSaveLabel(status, error);
  const id = `field-${sectionKey.replace(":", "-")}`;
  return (
    <div className={styles.lineField}>
      <div className={styles.introHead}>
        <label htmlFor={id} className="label">
          {label}
          {required ? "" : " (optional)"}
        </label>
        <span className={value.length > max ? styles.failed : styles.count}>
          {value.length} / {max}
        </span>
        {saved && (
          <span role="status" className={status === "failed" ? styles.failed : styles.count}>
            {saved}
          </span>
        )}
      </div>
      <input
        id={id}
        className="input"
        value={value}
        maxLength={max}
        required={required}
        onChange={(e) => {
          const v = e.target.value.replace(/\s+/g, " ").replace(/^ /, "");
          setValue(v);
          onText?.(v);
          change(lineDoc(v.trim()));
        }}
      />
    </div>
  );
}
