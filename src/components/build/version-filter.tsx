"use client";

import { useRouter } from "next/navigation";

/** Browse builds by LoreRim version. "all" shows every version. */
export function VersionFilter({ versions, value }: { versions: string[]; value: string }) {
  const router = useRouter();
  return (
    <label className="field">
      <span className="label">LoreRim version</span>
      <select className="select" value={value} onChange={(e) => router.push(`/?version=${encodeURIComponent(e.target.value)}`)}>
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
        <option value="all">All versions</option>
      </select>
    </label>
  );
}
