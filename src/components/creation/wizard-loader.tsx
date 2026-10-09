"use client";

import dynamic from "next/dynamic";
import { FocusHeader } from "@/components/ui/focus-header";

/** The wizard reads the draft from this browser, so it renders on the client only. */
export const WizardLoader = dynamic(() => import("./wizard").then((m) => m.Wizard), {
  ssr: false,
  loading: () => <FocusHeader context="New build" />,
});
