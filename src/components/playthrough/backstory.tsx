"use client";

import { useState } from "react";
import s from "./character-play.module.css";

/** Who she is, in plain paragraphs (WO-181): a drop cap, the first two paragraphs, then "Read all of it ›" for the rest (none when there are two or fewer). */
export function Backstory({ paragraphs }: { paragraphs: string[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? paragraphs : paragraphs.slice(0, 2);
  return (
    <div className={s.tale}>
      {shown.map((p, i) => (
        <p key={i}>
          {i === 0 ? (
            <>
              <span className={s.dc}>{p.charAt(0)}</span>
              {p.slice(1)}
            </>
          ) : (
            p
          )}
        </p>
      ))}
      {paragraphs.length > 2 && (
        <button type="button" className={s.more} aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? "Less ›" : "Read all of it ›"}
        </button>
      )}
    </div>
  );
}
