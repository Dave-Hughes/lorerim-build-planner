/**
 * A job's kind on a board line (WO-183 Part 4, WO-185 Part 3): "Deliver a Letter Distant" is the kind "Deliver a Letter" at the distance "Distant", on as many boards as there are
 * copies. The line's page lists each kind with an id from `kindSlug`, so a search result can open straight to it.
 */
export const jobKind = (name: string): string => {
  const m = /^(.*?)\s+(Near|Medium|Distant|Far|Med)$/.exec(name);
  return (m ? m[1] : name).replace(/\s+Board$/i, "");
};

export const kindSlug = (kind: string): string =>
  `kind-${kind
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
