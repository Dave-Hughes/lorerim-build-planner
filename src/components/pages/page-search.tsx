"use client";

import { SearchBox } from "@/components/search/search-box";

/** The search box at the top of a quest, person, line or place page: suggestions as you type, and all the results on Enter. */
export function PageSearch({ placeholder = "Search quests, people, places" }: { placeholder?: string }) {
  return <SearchBox placeholder={placeholder} />;
}
