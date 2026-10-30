import { ShotSection } from "./shot-section";
import { SignInButton } from "@/components/site-header";
import { pageShots } from "@/lib/screenshots/view";
import type { ShotKind } from "@/lib/screenshots/words";
import s from "./shot-section.module.css";

/** The Screenshots section further down a place's or a person's page (WO-184 Part 7), with its sign-in tile for a reader who isn't signed in. */
export async function ShotsSection({ kind, slug, name, back }: { kind: ShotKind; slug: string; name: string; back: string }) {
  const data = await pageShots(kind, slug);
  return (
    <ShotSection
      kind={kind}
      pageKey={slug}
      name={name}
      data={data}
      signInTile={<SignInButton redirectTo={`${back}#shots`} className={s.addt} label={<>+ Sign in to add a screenshot<small>Your own, from LoreRim</small></>} />}
    />
  );
}
