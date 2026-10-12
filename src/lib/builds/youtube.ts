/**
 * Video guides (WO-39): a YouTube link in any common form gives the video's id, which is all a
 * build stores. Nothing loads from YouTube until the player presses play (see video-guide.tsx).
 */

export const YOUTUBE_ERROR = "That isn't a YouTube link.";

const ID = /^[\w-]{11}$/;

/**
 * The 11-character video id from youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, /live/ or
 * /embed/ links (with or without www. or m., http or https, or the scheme left off, and any extra
 * parameters), or null for anything else.
 */
export function youtubeVideoId(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [, first, second] = url.pathname.split("/");
    if (first === "watch") id = url.searchParams.get("v");
    else if (["shorts", "live", "embed"].includes(first)) id = second ?? null;
  }
  return id && ID.test(id) ? id : null;
}

/** The video's thumbnail, the only thing shown before the player presses play. */
export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** The privacy-enhanced player, swapped in on play. */
export function youtubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
