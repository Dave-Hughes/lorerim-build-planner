"use client";

import { useEffect, useState } from "react";
import tips from "@/data/tips.json";

/** One loading-screen tip, a new one on each page load (picked after load, so cached pages vary too). */
export function FooterTip({ className }: { className?: string }) {
  const [tip, setTip] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random only after hydration, so server and client agree.
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);
  return <span className={className}>{tip ?? " "}</span>;
}
