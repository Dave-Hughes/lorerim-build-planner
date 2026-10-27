"use client";

import { IconLabel, TagIcon } from "@/components/ui/skill-icon";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TAGS, TAG_GROUPS, TAG_BY_SLUG } from "@/lib/builds/tags";
import { browseHref, type BrowseState } from "@/lib/builds/browse";
import { useDismiss } from "@/lib/use-dismiss";
import styles from "./browse-filters.module.css";

/**
 * The filter row over Browse builds: search, tags (a build must have all), race, LoreRim version
 * and sort. Everything lives in the URL, so a filtered list can be shared; typing updates the list
 * after 300 ms without a full page load.
 */
export function BrowseFilters({ state, versions, defaultVersion, races, empty, withRuns = false }: { state: BrowseState; versions: string[]; defaultVersion: string; races: string[]; empty: boolean; /** The "Has a playthrough" filter, while playthroughs are on. */ withRuns?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(state.q);
  const [tagsOpen, setTagsOpen] = useState(false);
  const go = (next: Partial<BrowseState>) => router.replace(browseHref({ ...state, q, ...next }, defaultVersion), { scroll: false });
  // The search box: 300 ms after the last key.
  const typed = useRef(false);
  useEffect(() => {
    if (!typed.current) return;
    const t = setTimeout(() => router.replace(browseHref({ ...state, q }, defaultVersion), { scroll: false }), 300);
    return () => clearTimeout(t);
    // Only the typed text starts the timer; the rest of the state comes along as it is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  const toggleTag = (slug: string) => go({ tags: state.tags.includes(slug) ? state.tags.filter((t) => t !== slug) : [...state.tags, slug] });
  const tagsWrap = useRef<HTMLDivElement>(null);
  const tagsButton = useRef<HTMLButtonElement>(null);
  useDismiss({ open: tagsOpen, onClose: () => setTagsOpen(false), inside: [tagsWrap], trigger: tagsButton });
  const filtered = !!(state.q || state.tags.length || state.race || state.run);
  const clear = () => {
    typed.current = false;
    setQ("");
    router.replace(browseHref({ q: "", tags: [], race: "", version: state.version, sort: state.sort }, defaultVersion), { scroll: false });
  };
  return (
    <>
      <section aria-label="Find characters" className={styles.row}>
        <label className={`field ${styles.search}`}>
          <span className="label">Search</span>
          <input
            type="search"
            className="input"
            value={q}
            placeholder="Name, author, race, deity, trait"
            onChange={(e) => {
              typed.current = true;
              setQ(e.target.value);
            }}
          />
        </label>
        <div ref={tagsWrap} className={`field ${styles.tags}`}>
          <span className="label" id="browse-tags-label">
            Tags
          </span>
          <button ref={tagsButton} type="button" className={`select ${styles.tagsButton}`} aria-expanded={tagsOpen} aria-labelledby="browse-tags-label browse-tags-value" onClick={() => setTagsOpen((o) => !o)}>
            <span id="browse-tags-value">{state.tags.length ? state.tags.map((t) => TAG_BY_SLUG.get(t)?.name ?? t).join(", ") : "Any"}</span>
          </button>
          {tagsOpen && (
            <div role="group" aria-label="Tags" className={styles.tagPanel}>
              {TAG_GROUPS.map((g) => (
                <div key={g} className={styles.tagGroup}>
                  <span className="sub-label">{g}</span>
                  <span className={styles.chips}>
                    {TAGS.filter((t) => t.group === g).map((t) => (
                      <button key={t.slug} type="button" className={styles.chip} aria-pressed={state.tags.includes(t.slug)} onClick={() => toggleTag(t.slug)}>
                        <IconLabel icon={<TagIcon tag={t.slug} />}>{t.name}</IconLabel>
                      </button>
                    ))}
                  </span>
                </div>
              ))}
              <button type="button" className="btn btn-sm" onClick={() => setTagsOpen(false)}>
                Done
              </button>
            </div>
          )}
        </div>
        <label className={`field ${styles.small}`}>
          <span className="label">Race</span>
          <select className="select" value={state.race} onChange={(e) => go({ race: e.target.value })}>
            <option value="">Any</option>
            {races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className={`field ${styles.small}`}>
          <span className="label">LoreRim version</span>
          <select className="select" value={state.version} onChange={(e) => go({ version: e.target.value })}>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
            <option value="all">All versions</option>
          </select>
        </label>
        {withRuns && (
          <label className={`field ${styles.small}`}>
            <span className="label">Playthrough</span>
            <select className="select" value={state.run ? "run" : ""} onChange={(e) => go({ run: e.target.value === "run" })}>
              <option value="">Any</option>
              <option value="run">Has a playthrough</option>
            </select>
          </label>
        )}
        <label className={`field ${styles.small}`}>
          <span className="label">Sort</span>
          <select className="select" value={state.sort} onChange={(e) => go({ sort: e.target.value === "liked" ? "liked" : "newest" })}>
            <option value="newest">Newest</option>
            <option value="liked">Most liked</option>
          </select>
        </label>
      </section>
      {state.tags.length > 0 && (
        <p className={styles.chosen}>
          {state.tags.map((t) => (
            <button key={t} type="button" className={styles.chosenTag} aria-label={`Remove the ${TAG_BY_SLUG.get(t)?.name ?? t} tag`} onClick={() => toggleTag(t)}>
              <IconLabel icon={<TagIcon tag={t} />}>{TAG_BY_SLUG.get(t)?.name ?? t}</IconLabel> <span aria-hidden="true">×</span>
            </button>
          ))}
        </p>
      )}
      {empty && filtered && (
        <div className={styles.none}>
          <p className="muted">No characters match.</p>
          <button type="button" className="btn btn-sm" onClick={clear}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
