import { registerBuildTools } from "./build-tools";
import { registerPlaythroughTools } from "./playthrough-tools";

/** The tools that need sign-in (WO-109b), each with the scope its token must carry; null: any token. */
let needs: Map<string, string | null> | null = null;

/** Read from the tools' own registration, so a new write tool needs sign-in without a list to keep. */
export function signInNeeds(): Map<string, string | null> {
  if (needs) return needs;
  const names = (register: (server: never) => void) => {
    const out: string[] = [];
    register({ registerTool: (name: string) => void out.push(name) } as never);
    return out;
  };
  const noop = async () => ({ content: [] });
  // report_quest files under the player's name (WO-121a Part 5): facts is enough.
  needs = new Map<string, string | null>([["whoami", null], ["report_quest", "facts"]]);
  for (const n of names((s) => registerBuildTools(s, noop, "https://planner.test"))) needs.set(n, "builds:write");
  // suggest_quests is a facts tool registered with the playthroughs (WO-111): open.
  for (const n of names((s) => registerPlaythroughTools(s, noop, "https://planner.test"))) if (n !== "suggest_quests") needs.set(n, "playthroughs:write");
  return needs;
}

/**
 * What a call needs before it runs (WO-109b): a tools/call of a sign-in tool with no token is "sign-in"
 * (a 401 that starts sign-in), one whose token lacks the tool's scope names the scope (a 403);
 * everything else, initialize, tools/list and the facts tools, passes.
 */
export function gateOf(body: unknown, token: { scopes: string[] } | null | undefined): { refuse: "sign-in" } | { refuse: "scope"; scope: string } | null {
  const calls = (Array.isArray(body) ? body : [body]) as { method?: string; params?: { name?: string } }[];
  for (const c of calls) {
    if (c?.method !== "tools/call" || typeof c.params?.name !== "string") continue;
    const need = signInNeeds();
    if (!need.has(c.params.name)) continue;
    if (!token) return { refuse: "sign-in" };
    const scope = need.get(c.params.name);
    if (scope && !token.scopes.includes(scope)) return { refuse: "scope", scope };
  }
  return null;
}
