/* eslint-disable @next/next/no-img-element */
import { Tooltip } from "./tooltip";

/**
 * What the AI assisted mark means (WO-117), in its tooltip, saying what the planner is (WO-124). The link to the planner
 * connector's page waits on WO-125.
 */
export const aiAssistedText = (author: string) =>
  `${author} made this with an AI assistant, like Claude, connected to the planner. The planner checks every level and perk against LoreRim's rules, as it does for any build you make here.`;

/**
 * The AI assisted mark (WO-117): the Dwemer head and the words. The whole mark is its tooltip's
 * trigger on hover, focus and tap (WO-118), with a dotted line under the words; no separate "i". The
 * assistant's name isn't printed. Inside a link (a card that is all one link), `tip` is off: a button
 * can't sit in a link, so the mark stands alone.
 */
export function AiAssisted({ author, tip = true, className }: { author: string; tip?: boolean; className?: string }) {
  const mark = (
    <>
      <img src="/icons/mark-ai-assisted.svg" alt="" width={16} height={16} className="px" />
      <span className="ai-assisted-words">AI assisted</span>
    </>
  );
  if (!tip) return <span className={`ai-assisted ${className ?? ""}`}>{mark}</span>;
  return (
    <Tooltip content={aiAssistedText(author)}>
      <button type="button" className={`ai-assisted ai-assisted-tip ${className ?? ""}`}>
        {mark}
      </button>
    </Tooltip>
  );
}
