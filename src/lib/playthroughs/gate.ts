/**
 * Playthroughs, held back from launch (WO-182). No "server-only" here: the proxy reads it.
 *
 * FEATURE_PLAYTHROUGHS set to "on" (or "1", "true") turns on /p/<id>, /playthroughs, the run box on a character's
 * card, acts, Who she is, the editor's Playthrough tab and the assistants' playthrough tools. Unset, it is on only
 * under `next dev`: staging and production leave it off, whatever Vercel has or hasn't set. The code, the tables
 * and the saved runs stay; nothing a visitor, a player or an assistant sees mentions them while it is off.
 */
export const playthroughsOn = (env: Record<string, string | undefined> = process.env) => {
  const v = env.FEATURE_PLAYTHROUGHS?.trim().toLowerCase();
  if (!v) return env.NODE_ENV === "development";
  return v === "on" || v === "1" || v === "true";
};

/**
 * The addresses that exist only for playthroughs (WO-182 Part 1): with the switch off the proxy answers every one
 * with the not found page. A character's own /b/<id> and /b/<id>/edit are not among them.
 */
export function isPlaythroughPath(path: string): boolean {
  return (
    /^\/p(\/|$)/.test(path) ||
    /^\/playthroughs(\/|$)/.test(path) ||
    /^\/api\/playthroughs(\/|$)/.test(path) ||
    /^\/api\/map\/characters?(\/|$)/.test(path) ||
    /^\/b\/[^/]+\/(play|run|story)(\/|$)/.test(path) ||
    /^\/b\/[^/]+\/edit\/(play|story)(\/|$)/.test(path)
  );
}
