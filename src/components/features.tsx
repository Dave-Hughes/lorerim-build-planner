"use client";

import { createContext, useContext } from "react";

/** The launch switches (WO-81), from the server, for client components. Both off unless provided. */
const FeaturesContext = createContext<{ story: boolean; siteGuide: boolean }>({ story: false, siteGuide: false });

export function FeaturesProvider({ value, children }: { value: { story: boolean; siteGuide: boolean }; children: React.ReactNode }) {
  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
}

export const useFeatures = () => useContext(FeaturesContext);
