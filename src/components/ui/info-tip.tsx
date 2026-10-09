import { useId } from "react";

/** A small "i" after a value. Hover, focus or tap shows the explanation. */
export function InfoTip({ label, text }: { label: string; text: string }) {
  const id = useId();
  return (
    <span className="tip">
      <button type="button" aria-label={label} aria-describedby={id}>
        <span>i</span>
      </button>
      <span role="tooltip" id={id}>
        {text}
      </span>
    </span>
  );
}
