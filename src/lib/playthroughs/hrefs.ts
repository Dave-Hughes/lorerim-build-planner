/**
 * Where a run is edited (WO-179 Part 2). The run's editor belongs to its character: /b/<character>/edit/play and
 * /b/<character>/edit/story/<page>. A run from before characters, with no build, keeps its old address under /p/ until it is given one.
 */
export const editBase = (run: { id: string; buildId?: string | null }) => (run.buildId ? `/b/${run.buildId}/edit` : `/p/${run.id}/edit`);

/** The Playthrough tab in edit mode, at an act when one is given. */
export const editPlayHref = (run: { id: string; buildId?: string | null }, act?: number | string | null) => `${editBase(run)}/play${act ? `?act=${act}` : ""}`;

/** The Story tab in edit mode at a page: `title`, a chapter's id, or `act-<id>`. */
export const editStoryHref = (run: { id: string; buildId?: string | null }, page: number | string = "title") => `${editBase(run)}/story/${page}`;
