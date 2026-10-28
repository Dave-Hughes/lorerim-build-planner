"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import l from "@/components/quests/line-page.module.css";

interface Item {
  id: string;
  label: string;
  icon: string | null;
}

/**
 * A contents rail for a page taller than two screens (WO-165): it reads the page's own section headings, lights the one in view, and shows
 * nothing on a short page. Anywhere a long quest, person, place or line page has a side column.
 */
export function AutoToc() {
  const [items, setItems] = useState<Item[]>([]);
  const [on, setOn] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      if (document.documentElement.scrollHeight < window.innerHeight * 2) return setItems([]);
      const heads = [...document.querySelectorAll<HTMLElement>("main section[aria-labelledby] h2[id]")].filter((h) => !h.closest("aside") && !h.closest('[class*="confidence"]'));
      setItems(
        heads.map((h) => ({
          id: h.id,
          label: (h.textContent ?? "").trim(),
          icon: h.parentElement?.querySelector("img")?.getAttribute("src") ?? null,
        })),
      );
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  useEffect(() => {
    if (!items.length || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = items.find((i) => seen.has(i.id));
        if (first) setOn(first.id);
      },
      { rootMargin: "-10% 0px -60% 0px" },
    );
    for (const i of items) {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);
  if (items.length < 3) return null;
  return (
    <nav className={l.toc} style={{ position: "sticky", top: 24 }} aria-label="On this page">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={on === i.id ? l.tocOn : undefined} aria-current={on === i.id ? "location" : undefined}>
          {i.icon && <img className={l.px} src={i.icon} alt="" width={18} height={18} />}
          {i.label}
        </a>
      ))}
    </nav>
  );
}
