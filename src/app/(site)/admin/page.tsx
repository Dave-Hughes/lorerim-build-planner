import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { EarlyAccess } from "@/components/admin/early-access";
import { BuildHistory } from "@/components/admin/build-history";
import { Connector } from "@/components/admin/connector";
import { ImportBuild } from "@/components/admin/import-build";
import { buildHistory } from "@/lib/builds/revision-queries";
import { doorCounts } from "@/lib/mcp/door-events";
import { mcpOn } from "@/lib/features";
import { isAdmin } from "@/lib/users/admin";
import { listEarlyAccess, listInvites } from "@/lib/users/invite-queries";
import { inviteState } from "@/lib/users/invites";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * The admins' page (WO-90, WO-96): the way to the review list, early access, importing a build, a build's saves
 * (WO-122, ?build=<id>) and the connector's counts (WO-119). Everyone else gets a 404.
 */
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ build?: string | string[] }> }) {
  const userId = (await auth())?.user?.id;
  if (!(await isAdmin(userId))) notFound();
  const asked = (await searchParams).build;
  const buildId = (Array.isArray(asked) ? asked[0] : asked)?.trim().slice(0, 40) ?? "";
  const [invites, people, door, history] = await Promise.all([listInvites(), listEarlyAccess(), mcpOn() ? doorCounts() : null, buildId ? buildHistory(buildId) : null]);
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
      <BuildHistory id={buildId} history={history} />
      {door && <Connector weeks={door} />}
    </main>
  );
}
