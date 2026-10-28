import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { InviteScene } from "@/components/invite/invite-scene";
import { SignInButton } from "@/components/site-header";
import { acceptInvite } from "@/lib/users/invite-actions";
import { canUseInvite, hashInviteToken, inviteLine, isInviteToken } from "@/lib/users/invites";
import cs from "@/components/coming-soon/coming-soon.module.css";

export const metadata: Metadata = { title: { absolute: "You're invited | LoreRim Planner" }, robots: { index: false } };
export const dynamic = "force-dynamic";

type Params = Promise<{ token: string }>;

/**
 * An early-access invite (WO-96), in the coming soon page's look: Tapps by the fire, and his line in
 * the story's dialogue box (the admin's own line for this person, or the usual one). Signed out, Sign in with Discord comes back here; signed in, Come in uses
 * the invite and opens the app. A used, run-out or unknown link says so, without saying which.
 */
export default async function InvitePage({ params }: { params: Params }) {
  const { token } = await params;
  const invite = isInviteToken(token)
    ? (await db().select({ label: schema.invites.label, message: schema.invites.message, usedBy: schema.invites.usedBy, expiresAt: schema.invites.expiresAt }).from(schema.invites).where(eq(schema.invites.tokenHash, hashInviteToken(token))).limit(1))[0]
    : undefined;
  if (!invite || !canUseInvite(invite)) {
    return <InviteScene line="This invite has been used or has run out. Ask Tapps for a new one." />;
  }
  const signedIn = !!(await auth())?.user?.id;
  return (
    <InviteScene line={inviteLine(invite.label, invite.message)}>
      {signedIn ? (
        <form action={acceptInvite.bind(null, token)}>
          <button type="submit" className={cs.button}>
            Come in
          </button>
        </form>
      ) : (
        <SignInButton redirectTo={`/invite/${token}`} className={cs.button} label="Sign in with Discord" />
      )}
    </InviteScene>
  );
}
