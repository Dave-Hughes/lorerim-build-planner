import { modsInOrder, type Mod } from "@/lib/mods";
import s from "./mods-needed.module.css";

/**
 * Mods this character needs (WO-139 Part 4): the ones LoreRim doesn't ship, required first, each with its link and why;
 * the recommended ones under a smaller heading. Nothing at all when the list is empty.
 */
export function ModsNeeded({ mods, className = "" }: { mods: readonly Mod[] | null | undefined; className?: string }) {
  const { required, recommended } = modsInOrder(mods);
  if (!required.length && !recommended.length) return null;
  return (
    <section aria-labelledby="mods-needed" className={`${s.mods} ${className}`}>
      <h2 id="mods-needed" className={s.h2}>
        Mods this character needs
      </h2>
      {required.length > 0 && <List mods={required} />}
      {recommended.length > 0 && (
        <>
          <h3 className={s.h3}>Recommended</h3>
          <List mods={recommended} />
        </>
      )}
    </section>
  );
}

function List({ mods }: { mods: Mod[] }) {
  return (
    <dl className={s.list}>
      {mods.map((m) => (
        <div key={m.name} className={s.row}>
          <dt>
            {m.link ? (
              <a href={m.link} target="_blank" rel="noopener noreferrer">
                {m.name}
              </a>
            ) : (
              m.name
            )}
          </dt>
          <dd>{m.why}</dd>
        </div>
      ))}
    </dl>
  );
}
