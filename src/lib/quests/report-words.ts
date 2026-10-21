/** What a quest report can be about (WO-103): the quest page's own parts, then anything else. */
export const REPORT_WHAT = ["How to start it", "What it needs", "Who and where", "Rewards", "The journal", "Something else"] as const;
export type ReportWhat = (typeof REPORT_WHAT)[number];

/** The most a report's text says (WO-103). */
export const REPORT_TEXT_MAX = 1000;

export const REPORT_THANKS = "Thanks. We'll check it.";
