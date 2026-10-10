import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@/db";

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
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
}));
