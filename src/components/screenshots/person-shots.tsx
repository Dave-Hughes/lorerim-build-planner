import { ShotGallery } from "./shot-gallery";
import { SignInButton } from "@/components/site-header";
import { pageShots } from "@/lib/screenshots/view";
import s from "./shot-gallery.module.css";

/** The screenshot beside a person's title, with its strip (WO-184 Part 1, board PicPerson). */
export async function PersonShots({ slug, name }: { slug: string; name: string }) {
  const data = await pageShots("person", slug);
  const back = `/people/${slug}`;
  return (
    <ShotGallery
      kind="person"
      pageKey={slug}
      name={name}
      data={data}
      layout="person"
      signInEmpty={<SignInButton redirectTo={back} className="btn btn-sm" label="Sign in to add a screenshot" />}
      signInStrip={<SignInButton redirectTo={back} className={s.add} label="+ Sign in to add a screenshot" />}
    />
  );
}
