import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GearTypeIcon, PluginName, Station } from "@/components/gear/gear-bits";
import { SkillIcon } from "@/components/ui/skill-icon";
import { Tooltip } from "@/components/ui/tooltip";
import { gearData } from "@/lib/gear/data";
import { backLabel, gearHref, gearType, itemSlug, parseGearQuery, pluginOf, type Recipe } from "@/lib/gear/query";
import { siteMetadata } from "@/lib/og/metadata";
import { gameData } from "@/lib/rules/server";
import type { GameItem } from "@/lib/items/search";
import styles from "@/components/gear/gear.module.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type Search = Promise<{ from?: string }>;

/** The item for a slug, or the item an old id (in its `also`) now belongs to. */
function find(slug: string): { item: GameItem; moved: boolean } | null {
  const { bySlug, old } = gearData();
  const item = bySlug.get(slug);
  if (item) return { item, moved: false };
  const now = old.get(slug);
  return now ? { item: now, moved: true } : null;
}

/** The line under the name: type | armor or weapon type | each stat. */
function statParts(item: GameItem): string[] {
  const parts = item.stats.split(", ").filter(Boolean);
  const type = gearType(item);
  return item.kind === "armor" && type ? [type, ...parts] : parts;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const hit = find((await params).slug);
  if (!hit) return {};
  const { item } = hit;
  const line = statParts(item).join(" | ");
  return { title: item.name, description: line, ...siteMetadata(`/gear/${itemSlug(item.id)}`, item.name, line) };
}

function PerkChip({ id }: { id: string }) {
  const perk = gameData(gearData().version)?.perks.find((p) => p.id === id);
  const tree = id.slice(0, id.indexOf(":"));
  const name = perk?.name ?? id.slice(id.indexOf(":") + 1);
  return (
    <Tooltip content={`${tree}. ${perk?.rankTexts?.[0] ?? perk?.text ?? ""}`.replace(/\. $/, "")}>
      <button type="button" className={styles.perk}>
        <SkillIcon name={tree} />
        {name}
      </button>
    </Tooltip>
  );
}

function Materials({ recipe }: { recipe: Recipe }) {
  return (
    <ul className={styles.materials}>
      {recipe.materials.map((m) => (
        <li key={m.name}>
          <b>{m.count}</b>
          <span>{m.name}</span>
        </li>
      ))}
    </ul>
  );
}

/** An item's page (WO-92): what it is, how to make and improve it, and its records. */
export default async function GearItemPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [{ slug }, { from }] = await Promise.all([params, searchParams]);
  const hit = find(slug);
  if (!hit) notFound();
  const { item, moved } = hit;
  if (moved) redirect(`/gear/${itemSlug(item.id)}${from ? `?from=${encodeURIComponent(from)}` : ""}`);
  const { recipes } = gearData();
  const r = recipes[item.id] ?? {};
  const back = from ? parseGearQuery(Object.fromEntries(new URLSearchParams(from))) : null;
  const backTo = back ? gearHref(back) : "/gear";
  const records = [item.id, ...(item.also ?? [])];

  const improve = r.improve?.length ? (
    <div className={styles.panel}>
      {r.improve.map((rec, i) => (
        <p key={i} className={styles.improve}>
          {r.make?.length ? <b>Improve it</b> : null}
          <span className="muted">{rec.station}</span>
          {rec.materials.map((m) => (
            <span key={m.name}>
              <b>{m.count}</b> {m.name}
            </span>
          ))}
        </p>
      ))}
    </div>
  ) : null;

  return (
    <main className={`page ${styles.itemMain}`}>
      <Link href={backTo} className={styles.back}>
        ‹ {back ? backLabel(back) : "Gear"}
      </Link>
      <div className={styles.itemHead}>
        <span className={styles.bigIcon} aria-hidden="true">
          {/* The type's pixel icon at 48 px: three times its own size, so it stays crisp. */}
          <span className={styles.bigIconInner}>
            <GearTypeIcon kind={item.kind} type={gearType(item)} />
          </span>
        </span>
        <span className={styles.itemTitle}>
          <h1 className={`title ${styles.h1}`}>{item.name}</h1>
          <span className={styles.statLine}>
            {statParts(item).map((p, i) => (
              <span key={i}>
                {i > 0 && (
                  <span className={styles.bar} aria-hidden="true">
                    |
                  </span>
                )}
                {p}
              </span>
            ))}
          </span>
        </span>
      </div>
      {item.text && <p className={`flavor ${styles.itemText}`}>{item.text}</p>}

      <div className={styles.itemGrid}>
        <div className={styles.itemColumn}>
          {r.make?.length ? (
            <section aria-labelledby="make-it" className={styles.section}>
              <h2 id="make-it" className={styles.h2}>
                Make it
              </h2>
              {r.make.map((rec, i) => (
                <div key={i} className={`frame ${styles.panel}`}>
                  <p className={styles.needs}>
                    <span className={styles.stationBig}>
                      <Station name={rec.station} />
                    </span>
                    {rec.perks.length > 0 && <span className="muted">needs</span>}
                    {rec.perks.map((p) => (
                      <PerkChip key={p} id={p} />
                    ))}
                  </p>
                  <Materials recipe={rec} />
                  {rec.makes && <p className="muted">Makes {rec.makes}</p>}
                  {rec.otherConditions ? <p className={styles.unknown}>Other conditions apply in game.</p> : null}
                </div>
              ))}
              {improve}
            </section>
          ) : improve ? (
            <section aria-labelledby="improve-it" className={styles.section}>
              <h2 id="improve-it" className={styles.h2}>
                Improve it
              </h2>
              {improve}
            </section>
          ) : null}

          <section aria-labelledby="find-it" className={styles.section}>
            <h2 id="find-it" className={styles.h2}>
              Where to find it
            </h2>
            <p className={styles.findText}>Not listed yet. The game&apos;s records don&apos;t say which chest, merchant or enemy carries an item, so we don&apos;t guess.</p>
          </section>
        </div>

        <aside className={styles.itemColumn}>
          <section aria-labelledby="records" className={styles.section}>
            <h2 id="records" className={styles.h2}>
              Records
            </h2>
            <dl className={styles.records}>
              {records.map((id) => (
                <div key={id}>
                  <dt>
                    <PluginName plugin={pluginOf(id)} />
                  </dt>
                  <dd>{id.slice(id.lastIndexOf(":") + 1)}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}
