/**
 * A trait's text from the game, its <numbers> in bold. With `colours` (the coming soon page, WO-85)
 * the numbers before "However" are the benefit's green and the ones after it the cost's red, as the
 * trait cards on the canvas show them.
 */
export function TraitText({ text, colours = false }: { text: string; colours?: boolean }) {
  const cut = colours ? text.search(/\bHowever\b/) : -1;
  // Each <number>, with whether it comes after "However" (the cost).
  const parts = [...text.matchAll(/<([^<>]*)>|[^<]+|</g)].map((m) => ({ number: m[1], text: m[0], cost: cut >= 0 && (m.index ?? 0) >= cut }));
  return (
    <>
      {parts.map((p, i) =>
        p.number === undefined ? (
          p.text
        ) : (
          <b key={i} data-trait={colours ? (p.cost ? "cost" : "benefit") : undefined} style={colours ? { color: p.cost ? "var(--health)" : "var(--stamina)" } : undefined}>
            {p.number}
          </b>
        ),
      )}
    </>
  );
}
