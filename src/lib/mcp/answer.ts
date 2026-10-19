/** An MCP tool's answer (WO-108): JSON text, cut to 64 KB with a note when it's longer. */
export const MAX_BYTES = 64 * 1024;

export type Answer = { content: { type: "text"; text: string }[]; isError?: boolean };

/** One JSON answer, cut to 64 KB with a note when it's longer. */
export function answer(value: unknown): Answer {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 1);
  const bytes = new TextEncoder().encode(text);
  if (bytes.length <= MAX_BYTES) return { content: [{ type: "text", text }] };
  const cut = new TextDecoder().decode(bytes.slice(0, MAX_BYTES - 200));
  return { content: [{ type: "text", text: `${cut}\n\n[Cut at 64 KB: the answer was longer. Ask for less, or a narrower search.]` }] };
}

