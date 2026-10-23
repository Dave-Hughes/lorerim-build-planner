"use client";

import { useState } from "react";
import { MODS_LIMITS, type Mod } from "@/lib/mods";

/**
 * The mods a character needs (WO-139 Part 4), as a plain list to add to, edit and remove from: name, link, why, required
 * or recommended. A row is saved when it has a name and a why; `onChange` gets the complete rows each time a field is left.
 */
export function ModsEditor({ mods, onChange, idPrefix = "mod" }: { mods: readonly Mod[]; onChange: (mods: Mod[]) => void; idPrefix?: string }) {
  const [rows, setRows] = useState<Mod[]>(() => mods.map((m) => ({ ...m })));
  const keep = (next: Mod[]) => {
    const whole = next.filter((m) => m.name.trim() && m.why.trim()).map((m) => ({ name: m.name.trim(), ...(m.link?.trim() ? { link: m.link.trim() } : {}), why: m.why.trim(), need: m.need }));
    if (JSON.stringify(whole) !== JSON.stringify(mods.map((m) => ({ name: m.name, ...(m.link ? { link: m.link } : {}), why: m.why, need: m.need })))) onChange(whole);
  };
  const set = (i: number, patch: Partial<Mod>) => setRows((r) => r.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((m, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 0", borderTop: "1px solid var(--rule)" }}>
          <input id={`${idPrefix}-name-${i}`} className="input" aria-label={`Mod ${i + 1} name`} placeholder="[Mod name]" value={m.name} maxLength={MODS_LIMITS.name} onChange={(e) => set(i, { name: e.target.value })} onBlur={() => keep(rows)} />
          <input className="input" type="url" aria-label={`Mod ${i + 1} link`} placeholder="[Nexus link, when it has one]" value={m.link ?? ""} maxLength={MODS_LIMITS.link} onChange={(e) => set(i, { link: e.target.value })} onBlur={() => keep(rows)} />
          <textarea className="textarea" rows={2} aria-label={`Mod ${i + 1} why`} placeholder="[What this character needs it for]" value={m.why} maxLength={MODS_LIMITS.why} onChange={(e) => set(i, { why: e.target.value })} onBlur={() => keep(rows)} />
          <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select
              className="select"
              aria-label={`Mod ${i + 1} need`}
              value={m.need}
              onChange={(e) => {
                const next = rows.map((x, j) => (j === i ? { ...x, need: e.target.value as Mod["need"] } : x));
                setRows(next);
                keep(next);
              }}
            >
              <option value="required">Required</option>
              <option value="recommended">Recommended</option>
            </select>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                const next = rows.filter((_, j) => j !== i);
                setRows(next);
                keep(next);
              }}
            >
              Remove
            </button>
          </span>
        </div>
      ))}
      {rows.length < MODS_LIMITS.mods && (
        <button type="button" className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setRows((r) => [...r, { name: "", why: "", need: "required" }])}>
          Add a mod
        </button>
      )}
    </div>
  );
}
