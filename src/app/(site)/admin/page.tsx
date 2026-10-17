import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { EarlyAccess } from "@/components/admin/early-access";
import { ImportBuild } from "@/components/admin/import-build";
import { isAdmin } from "@/lib/users/admin";
import { listEarlyAccess, listInvites } from "@/lib/users/invite-queries";
import { inviteState } from "@/lib/users/invites";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

/** The admins' page (WO-90, WO-96): the way to the review list, early access, and importing a build. Everyone else gets a 404. */
export default async function AdminPage() {
  const userId = (await auth())?.user?.id;
  if (!(await isAdmin(userId))) notFound();
  const [invites, people] = await Promise.all([listInvites(), listEarlyAccess()]);
  return (
    <main className={`page ${styles.main}`}>
      <h1 className="title">Admin</h1>
      <p>
        <Link href="/admin/review">The review list</Link>: images and reported builds waiting on an admin.
      </p>
      <EarlyAccess
        invites={invites.map((i) => ({ id: i.id, label: i.label, createdAt: i.createdAt, state: inviteState(i), usedByName: i.usedByName }))}
        people={people.map((p) => ({ id: p.id, name: p.name ?? "Unknown", image: p.image, at: p.at! }))}
      />
      <ImportBuild />
    </main>
  );
}
