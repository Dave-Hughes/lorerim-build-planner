"use client";

import { SearchBox } from "@/components/search/search-box";

/** Search on the Quests page (WO-100, WO-154): the same box as everywhere, with suggestions as you type. */
export function QuestSearch({ initial }: { initial: string }) {
  return <SearchBox initial={initial} placeholder="Search quests, people, places" />;
}
