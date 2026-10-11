"use client";

import { useState } from "react";

/** Copies this site's `path` as a full link; says "Copied" for two seconds. */
export function CopyLinkButton({ path, className = "btn btn-sm" }: { path: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard (an old browser, a denied permission): the address bar still has the link.
    }
  };
  return (
    <button type="button" className={className} onClick={() => void copy()}>
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
