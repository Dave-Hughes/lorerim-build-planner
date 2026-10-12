"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reviewBuild, reviewImage, type ReviewAction } from "@/lib/moderation/actions";

/** Keep, Hide image, Remove image (WO-40). Remove deletes the image for good, so it asks first. */
export function ReviewActions({ target }: { target: { kind: "image"; id: number } | { kind: "build"; id: string } }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (action: ReviewAction) => {
    if (action === "remove" && !window.confirm("Remove this image for good? It's deleted from the store.")) return;
    setError(null);
    start(async () => {
      const r = target.kind === "image" ? await reviewImage(target.id, action) : await reviewBuild(target.id, action);
      if (!r.ok) return setError(r.error);
      router.refresh();
    });
  };
  return (
    <span style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 6 }}>
      <button type="button" className="btn btn-sm btn-primary" disabled={pending} onClick={() => run("keep")}>
        Keep
      </button>
      <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run("hide")}>
        Hide image
      </button>
      <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run("remove")}>
        Remove image
      </button>
      {error && <span className="field-error">{error}</span>}
    </span>
  );
}
