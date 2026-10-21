/**
 * The MCP door's address (WO-109b): /api/mcp, or any path under it, so a player can add the same door
 * again as a fresh connector (Claude keys connectors by URL). Tokens aren't tied to the path.
 */
export const MCP_PATH = "/api/mcp";

/** Whether `value` is this site's door: https://<this host>/api/mcp or /api/mcp/<rest>, with no query or fragment. */
export function isMcpResource(origin: string, value: string): boolean {
  if (value.includes("?") || value.includes("#")) return false;
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return false;
  }
  if (u.origin !== origin) return false;
  const path = u.pathname.replace(/\/+$/, "");
  return path === MCP_PATH || path.startsWith(`${MCP_PATH}/`);
}

/** The resource a door's path names: the path the client used, from /api/mcp down. */
export function resourceAt(origin: string, rest: string[] | undefined): string {
  const tail = (rest ?? []).filter(Boolean).map(encodeURIComponent).join("/");
  return `${origin}${MCP_PATH}${tail ? `/${tail}` : ""}`;
}
