/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { pageShots } from "@/lib/screenshots/view";
import type { ShotKind } from "@/lib/screenshots/words";
import { shotCaption } from "@/lib/screenshots/words";
import s from "./shot-hero.module.css";

/**
 * The lead screenshot as the hero's background (WO-184 Part 7, boards PicPlace and PicPerson): full width, about 600 tall, the page's title, tags and lede over it on the
 * left (darkened behind the text and faded into the page at the foot), and "Screenshot by <name>" at the foot on the right, linking to the Screenshots section. It crops to
 * fill, keeping the middle. With no approved screenshot the hero is the page's own plain one, and a reader's own screenshot under review is never the hero.
 */
export async function ShotHero({ kind, slug, children }: { kind: ShotKind; slug: string; children: ReactNode }) {
  const { shots } = await pageShots(kind, slug);
  const lead = shots.find((x) => x.status === "live");
  if (!lead) return <>{children}</>;
  return (
    <section className={s.hero} data-hero="shot">
      <img className={s.bg} src={lead.url} alt="" />
      <div className={s.in}>{children}</div>
      <a className={s.credit} href="#shots">
        {lead.byImage ? <img className={s.av} src={lead.byImage} alt="" /> : <span className={s.av} />}
        {shotCaption(lead.byName)}
      </a>
    </section>
  );
}
