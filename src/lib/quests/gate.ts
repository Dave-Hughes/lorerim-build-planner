import type { QuestLine } from "./types";

/**
 * Whether a line's level gate was read (WO-183 Part 4): `checked.gate` is "files", or the line has a minimum level of its own. A line
 * whose gate nobody read has no gate to print: "Any level" is a claim that the start asks for nothing, and only a read start can say it.
 */
export const gateKnown = (line: Pick<QuestLine, "checked" | "minLevel">) => !!line.minLevel || line.checked?.gate === "files";

/** A line's level as a page says it: "Level 20", "Any level" when the start was read and asks for none, else "Not sure yet". */
export const lineLevelText = (line: Pick<QuestLine, "checked" | "minLevel">) => (line.minLevel ? `Level ${line.minLevel}` : gateKnown(line) ? "Any level" : "Not sure yet");
