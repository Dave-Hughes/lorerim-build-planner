/** The heart and the likes count, for cards, the shared page and its sign-in button. */
export function Heart({ filled }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M8 14s-5.5-3.4-5.5-7.4A3 3 0 0 1 8 4.7a3 3 0 0 1 5.5 1.9C13.5 10.6 8 14 8 14z" />
    </svg>
  );
}

/** "3 likes", for the count shown beside a heart. */
export const likesLabel = (n: number) => `${n} like${n === 1 ? "" : "s"}`;
