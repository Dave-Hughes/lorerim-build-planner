"use client";

import { useState, useTransition } from "react";
import { deleteBuild } from "@/lib/builds/actions";

/** Two taps to delete: the first arms it, the second does it. */
export function DeleteBuildButton({ id, name }: { id: string; name: string }) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={`btn btn-sm ${armed ? "btn-ember" : "btn-quiet"}`}
      aria-label={armed ? `Confirm: delete ${name}` : `Delete ${name}`}
      disabled={pending}
      onClick={() => (armed ? start(() => deleteBuild(id)) : setArmed(true))}
      onBlur={() => setArmed(false)}
    >
      {pending ? "Deleting…" : armed ? "Confirm delete" : "Delete"}
    </button>
  );
}
