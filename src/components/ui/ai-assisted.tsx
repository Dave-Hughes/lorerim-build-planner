/* eslint-disable @next/next/no-img-element */
import { InfoTip } from "./info-tip";

/** What the AI assisted mark means (WO-117), in the "i". */
export const aiAssistedText = (author: string) => `${author} made this with an AI assistant through the planner. The planner checked every level and perk against the game's rules, as it does for any build.`;

/**
 * The AI assisted mark (WO-117), where "Drafted with <assistant>" used to show: the Dwemer head, the
 * words, and an "i" with what it means. The assistant's name isn't printed. Inside a link (a card
 * that is all one link), `tip` is off: a button can't sit in a link, so the words stand alone.
 */
export function AiAssisted({ author, tip = true, className }: { author: string; tip?: boolean; className?: string }) {
  return (
    <span className={`ai-assisted ${className ?? ""}`}>
      <img src="/icons/mark-ai-assisted.svg" alt="" width={16} height={16} className="px" />
      <span>AI assisted</span>
      {tip && <InfoTip label="What AI assisted means" text={aiAssistedText(author)} />}
    </span>
  );
}
