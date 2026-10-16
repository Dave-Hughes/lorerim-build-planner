import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ImportBuild } from "@/components/admin/import-build";
import { isAdmin } from "@/lib/users/admin";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

/** The admins' page (WO-90): importing a build, and the way to the review list. Everyone else gets a 404. */
export default async function AdminPage() {
  const userId = (await auth())?.user?.id;
  if (!(await isAdmin(userId))) notFound();
  return (
    <main className={`page ${styles.main}`}>
      <h1 className="title">Admin</h1>
      <p>
        <Link href="/admin/review">The review list</Link>: images and reported builds waiting on an admin.
      </p>
      <ImportBuild />
    </main>
  );
}
