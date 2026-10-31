import type { ReactNode } from "react";
import { PageTop } from "@/components/pages/page-kit";
import { SignInButton } from "@/components/site-header";
import { pageShots } from "@/lib/screenshots/view";
import type { ShotKind } from "@/lib/screenshots/words";
import { Frame } from "./frame";
import f from "./frame.module.css";
import s from "./top-frame.module.css";

/**
 * The top of a place's or a person's page (WO-184 Part 8, board PlaceOptB): two columns at 1440. On the left the title, tags and lede, the key facts as a two-column list and
 * the way there; on the right one 16:9 frame, 640 wide, that is a screenshot or the map, with its thumbnails. At 390 the title, tags and lede come first, then the frame, then
 * the facts. `map` is the map for the frame, or null when the planner knows no place to show.
 */
export async function TopFrame({ kind, slug, name, back, head, facts, map }: { kind: ShotKind; slug: string; name: string; back: { href: string; label: string }; head: ReactNode; facts: ReactNode; map: ReactNode | null }) {
  const data = await pageShots(kind, slug);
  const home = `${kind === "place" ? "/places" : "/people"}/${slug}`;
  return (
    <>
      <div className={`page ${s.back}`}>
        <PageTop back={back} />
      </div>
      <div className={`page ${s.grid}`}>
        <div className={s.head}>{head}</div>
        <div className={s.frame}>
          <Frame
            kind={kind}
            pageKey={slug}
            name={name}
            data={data}
            map={map}
            signInPlus={<SignInButton redirectTo={home} className={f.tadd} label={<span aria-label="Sign in to add a screenshot">+</span>} />}
            signInText={<SignInButton redirectTo={home} className={f.link} label="Sign in to add yours" />}
          />
        </div>
        <div className={s.facts}>{facts}</div>
      </div>
    </>
  );
}

/** "Getting there  Up the mountain west of Riverwood, a short walk." in one line, under the facts. */
export function GettingThere({ text }: { text: string }) {
  return (
    <p className={s.there}>
      <b>Getting there</b> {text}
    </p>
  );
}
