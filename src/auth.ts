import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@/db";
import { assignHandle } from "@/lib/users/assign-handle";

/**
 * Discord sign-in. Only the "identify" scope is requested: we store the
 * Discord name and avatar, never the email address.
 *
 * Needs AUTH_SECRET, AUTH_DISCORD_ID and AUTH_DISCORD_SECRET. The config is a
 * function so nothing connects to the database until someone signs in.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(db(), {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  providers: [
    Discord({
      authorization: { params: { scope: "identify" } },
      // Discord now sends `iss=https://discord.com` back with the code (RFC 9207). Without this
      // the library compares it against its placeholder issuer and refuses the sign-in.
      issuer: "https://discord.com",
    }),
  ],
  events: {
    // A handle for /u/<handle> on first sign-in (then never changed). A failure here must not
    // stop the sign-in; the backfill or the next sign-in fills it.
    async signIn({ user }) {
      if (user.id) await assignHandle(db(), user.id).catch(() => null);
    },
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
}));
