"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Piece } from "@/lib/pages/link-names";
import type { Chapter, Chip, LineQuest } from "@/lib/quests/line-view";
import l from "./line-page.module.css";

const KEY = "planner.hideahead";
const EVENT = "planner-hideahead";

/** "Hide what's ahead", remembered for this viewer in this browser; off on the server, so the page is whole until the browser says otherwise. */
function useHideAhead(): [boolean, () => void] {
  const hide = useSyncExternalStore(
    (notify) => {
      window.addEventListener(EVENT, notify);
      window.addEventListener("storage", notify);
      return () => {
        window.removeEventListener(EVENT, notify);
        window.removeEventListener("storage", notify);
      };
    },
    () => {
      try {
        return localStorage.getItem(KEY) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );
  const toggle = () => {
    try {
      localStorage.setItem(KEY, hide ? "0" : "1");
    } catch {
      // Not remembered.
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [hide, toggle];
}
const ICON: Record<Chip["kind"], string> = { pick: "quest-ways", danger: "tab-levels" };

function ChipView({ c }: { c: Chip }) {
  const body = (
    <>
      <img className={l.px} src={`/icons/${ICON[c.kind]}.svg`} alt="" width={16} height={16} />
      {c.text}
    </>
  );
  const cls = `${l.chip} ${l[c.kind]}`;
  return c.href ? (
    <Link href={c.href} className={cls}>
      {body}
    </Link>
  ) : (
    <span className={cls}>{body}</span>
  );
}

/** A sentence with the people and places it names as links, where they are written. */
function Words({ text, parts }: { text: string; parts?: Piece[] }) {
  if (!parts) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.href ? (
          <Link key={i} href={p.href} className={`${l.inline} ${p.href.startsWith("/places/") ? l.inlinePlace : ""}`}>
            {p.text}
          </Link>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

function QuestView({ q, first, last }: { q: LineQuest; first: boolean; last: boolean }) {
  return (
    <li id={`q-${q.key}`} className={`${l.q} ${first ? l.qFirst : ""} ${last ? l.qLast : ""}`}>
      <i className={`${l.node} ${q.start ? l.nodeStart : ""}`} aria-hidden="true" />
      <div className={l.qn}>
        {q.href ? <Link href={q.href}>{q.name}</Link> : <b className={l.qname}>{q.name}</b>}
        {q.task && (
          <span className={l.obj}>
            <Words text={q.task} parts={q.taskParts} />
          </span>
        )}
        {q.note && (
          <span className={l.note}>
            <Words text={q.note} parts={q.noteParts} />
          </span>
        )}
        {q.chips.length > 0 && (
          <span className={l.chips}>
            {q.chips.map((c, i) => (
              <ChipView key={i} c={c} />
            ))}
          </span>
        )}
      </div>
      {q.xp > 0 && (
        <span className={l.xp}>
          {q.xp.toLocaleString("en-US")}
          <small>XP</small>
        </span>
      )}
    </li>
  );
}

const count = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

/**
 * The story, chapter by chapter (WO-160, LinePage): each quest linked, its first step, who and where as chips, its XP. "Hide what's ahead"
 * keeps the first chapter and shows only a number, a count and an XP for the rest; it is remembered for this viewer.
 */
export function LineStory({ chapters, numbered, hideable, id, title, icon }: { chapters: Chapter[]; numbered: boolean; hideable: boolean; id: string; title: string; icon: string }) {
  const [hide, toggle] = useHideAhead();
  return (
    <section className={l.sec} id={id} aria-labelledby={`${id}-h`}>
      <div className={l.sechd}>
        <h2 id={`${id}-h`} className={l.h2}>
          <img className={l.px} src={`/icons/${icon}.svg`} alt="" width={30} height={30} />
          {title}
        </h2>
        {hideable && (
          <button type="button" role="switch" aria-checked={hide} className={l.toggle} onClick={toggle}>
            <span className={`${l.sw} ${hide ? l.swOn : ""}`} aria-hidden="true">
              <i />
            </span>
            Hide what&apos;s ahead
          </button>
        )}
      </div>
      {chapters.map((c, ci) => {
        const ahead = hide && hideable && ci > 0;
        return (
          <div key={ci} className={`${l.ch} ${numbered ? "" : l.chPlain}`} data-ahead={ahead || undefined}>
            {numbered && (
              <span className={l.n}>
                <small>{c.side ? "Side" : "Chapter"}</small>
                {c.side ?? c.n}
              </span>
            )}
            <div>
              {(c.name || numbered) && (
                <div className={l.chh}>
                  <b className={(c.name?.length ?? 0) > 48 ? l.chLong : undefined}>{ahead ? (c.side ? `Side ${c.side}` : `Chapter ${c.n}`) : c.name}</b>
                  <span>
                    {count(c.quests.length, numbered ? "quest" : "job")}
                    {c.xp > 0 && (
                      <>
                        {" | "}
                        <em>{c.xp.toLocaleString("en-US")} XP</em>
                      </>
                    )}
                  </span>
                </div>
              )}
              {!ahead && (
                <ol className={l.qs}>
                  {c.quests.map((q, qi) => (
                    <QuestView key={q.key} q={q} first={qi === 0} last={qi === c.quests.length - 1} />
                  ))}
                </ol>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

/** Along the way: the jobs that open as the story goes on. */
export function LineJobs({ jobs, note, id }: { jobs: LineQuest[]; note: string; id: string }) {
  if (!jobs.length) return null;
  return (
    <section className={l.sec} id={id} aria-labelledby={`${id}-h`}>
      <div className={l.sechd}>
        <h2 id={`${id}-h`} className={l.h2}>
          <img className={l.px} src="/icons/quest-jobs-and-errands.svg" alt="" width={30} height={30} />
          Along the way
        </h2>
        <span className={l.cap}>{note}</span>
      </div>
      <div className={l.jobs}>
        {jobs.map((j) => (
          <div key={j.key} className={l.job}>
            <img className={l.px} src="/icons/quest-jobs-and-errands.svg" alt="" width={28} height={28} />
            <div>
              {j.href ? <Link href={j.href}>{j.name}</Link> : <b className={l.qname}>{j.name}</b>}
              {j.task && (
                <p>
                  <Words text={j.task} parts={j.taskParts} />
                </p>
              )}
              {j.chips.length > 0 && (
                <span className={l.chips}>
                  {j.chips.map((c, i) => (
                    <ChipView key={i} c={c} />
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The contents, on the right: the section in view is lit. */
export function LineToc({ items }: { items: { id: string; label: string; icon: string }[] }) {
  const [on, setOn] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = items.find((i) => seen.has(i.id));
        if (first) setOn(first.id);
      },
      { rootMargin: "-10% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className={l.toc} aria-label="On this page">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={on === i.id ? l.tocOn : undefined} aria-current={on === i.id ? "location" : undefined}>
          <img className={l.px} src={`/icons/${i.icon}.svg`} alt="" width={18} height={18} />
          {i.label}
        </a>
      ))}
    </nav>
  );
}
