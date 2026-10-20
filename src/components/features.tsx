"use client";

import { createContext, useContext } from "react";

/** The launch switches (WO-81), from the server, for client components. Both off unless provided. */
type Switches = { story: boolean; siteGuide: boolean; gear: boolean; quests: boolean; playthroughs: boolean };
const FeaturesContext = createContext<Switches>({ story: false, siteGuide: false, gear: false, quests: false, playthroughs: false });

export function FeaturesProvider({ value, children }: { value: Switches; children: React.ReactNode }) {
  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>;
}

export const useFeatures = () => useContext(FeaturesContext);
