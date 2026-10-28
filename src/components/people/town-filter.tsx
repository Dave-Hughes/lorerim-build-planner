"use client";

import { useRouter } from "next/navigation";

/** People's town filter (WO-161): picking a town applies it at once, keeping the group; with no script, a Show button does it. */
export function TownFilter({ group, town, towns }: { group?: string; town?: string; towns: [string, number][] }) {
  const router = useRouter();
  const go = (t: string) => {
    const p = new URLSearchParams();
    if (group) p.set("group", group);
    if (t) p.set("town", t);
    router.push(p.size ? `/people?${p}` : "/people");
  };
  return (
    <form method="get" action="/people" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      {group && <input type="hidden" name="group" value={group} />}
      <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <span className="sub-label">Town</span>
        <select className="select" name="town" value={town ?? ""} onChange={(e) => go(e.target.value)}>
          <option value="">Anywhere</option>
          {towns.map(([t, n]) => (
            <option key={t} value={t}>
              {t} ({n})
            </option>
          ))}
        </select>
      </label>
      <noscript>
        <button type="submit" className="btn btn-sm">
          Show
        </button>
      </noscript>
    </form>
  );
}
