/** What a report can say is wrong (WO-40). */
export const REPORT_REASONS = [
  { id: "sexual", label: "Sexual content" },
  { id: "hateful", label: "Hateful content" },
  { id: "spam", label: "Spam" },
  { id: "other", label: "Something else" },
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]["id"];

/** Open reports that hide a build's images until an admin decides. */
export const REPORTS_TO_HIDE = 3;

export const HIDDEN_IMAGE_TEXT = "This image is waiting for a look.";
