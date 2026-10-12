import { describe, expect, it } from "vitest";
import { youtubeVideoId } from "./youtube";

const ID = "dQw4w9WgXcQ";

describe("youtubeVideoId", () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}`,
    `https://m.youtube.com/watch?v=${ID}`,
    `http://www.youtube.com/watch?v=${ID}`,
    `www.youtube.com/watch?v=${ID}`,
    `youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/watch?v=${ID}&t=42s&list=PL123`,
    `https://www.youtube.com/watch?feature=share&v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc123&t=10`,
    `youtu.be/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://youtube.com/shorts/${ID}?feature=share`,
    `https://m.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    `https://youtube.com/live/${ID}?si=xyz`,
    `https://www.youtube.com/embed/${ID}`,
    `  https://youtu.be/${ID}  `,
  ])("reads %s", (link) => {
    expect(youtubeVideoId(link)).toBe(ID);
  });

  it.each([
    "https://vimeo.com/123456789",
    "https://player.vimeo.com/video/123456789",
    "a great video about archery",
    "",
    "https://www.youtube.com/@Zenematics",
    "https://www.youtube.com/watch?v=short",
    "https://notyoutube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
  ])("refuses %s", (text) => {
    expect(youtubeVideoId(text)).toBeNull();
  });
});
