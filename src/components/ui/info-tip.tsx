"use client";

import { Tooltip } from "./tooltip";

/**
 * A small "i" after a value. A client component, so the trigger it hands the tooltip is made in the browser and not carried in the server's
 * payload: on the deployed home page that element arrived unresolved and the page was a 500 (WO-170 review).
 *
 * Hover, focus or tap shows the explanation.
 */
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
