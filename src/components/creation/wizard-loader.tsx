"use client";

import dynamic from "next/dynamic";
import { EditBar, useEditFrame } from "@/components/editor/edit-bar";
import { FocusHeader } from "@/components/ui/focus-header";

/** The wizard reads the draft from this browser, so it renders on the client only. */
export const WizardLoader = dynamic(() => import("./wizard").then((m) => m.Wizard), {
  ssr: false,
  loading: () => <FocusHeader context="New build" />,
});

/**
 * The edit bar from the page's frame, while the wizard loads (WO-124 Part 4): Set up in edit showed New build's header
 * for 0.3 s first, so the bar dropped out on every change of tab to it.
 */
function FrameBar() {
  const f = useEditFrame();
  return f?.build ? <EditBar buildId={f.build.id} name={f.name} current="setup" visibility={f.build.visibility} /> : null;
}

/** The wizard in edit, with the edit bar showing while it loads. */
export const EditWizardLoader = dynamic(() => import("./wizard").then((m) => m.Wizard), {
  ssr: false,
  loading: () => <FrameBar />,
});
