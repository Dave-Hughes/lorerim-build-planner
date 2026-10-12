"use client";

/* eslint-disable @next/next/no-img-element -- the thumbnail comes straight from i.ytimg.com; next/image would proxy it. */
import { useEffect, useRef, useState } from "react";
import { youtubeEmbed, youtubeThumbnail } from "@/lib/builds/youtube";
import { PlayMark } from "./play-mark";
import styles from "./video-guide.module.css";

/**
 * A build's video guide (WO-39), full width at 16:9 at the top of the Guide tab. Nothing loads from
 * YouTube until the player presses play: until then it's the video's thumbnail with a play button,
 * then the privacy-enhanced (youtube-nocookie.com) player, started. `play` starts it from outside
 * (the hero's "Watch the video guide"); each new value plays again.
 */
export function VideoGuide({ videoId, title, play = 0 }: { videoId: string; title: string; play?: number }) {
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!play) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- started from the hero's button.
    setPlaying(true);
    box.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [play]);
  return (
    <div ref={box} id="video-guide" className={styles.video}>
      {playing ? (
        <iframe
          className={styles.frame}
          src={youtubeEmbed(videoId)}
          title={`Video guide: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={`Play the video guide: ${title}`}>
          <img src={youtubeThumbnail(videoId)} alt="" className={styles.thumb} />
          <span className={styles.play} aria-hidden="true">
            <PlayMark />
          </span>
          <span className={styles.caption}>Video guide</span>
        </button>
      )}
    </div>
  );
}

