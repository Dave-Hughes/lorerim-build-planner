import { Tooltip } from "./tooltip";

/** A small "i" after a value. Hover, focus or tap shows the explanation. */
export function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <span className="tip">
      <Tooltip content={text}>
        <button type="button" aria-label={label}>
          <span>i</span>
        </button>
      </Tooltip>
    </span>
  );
}
