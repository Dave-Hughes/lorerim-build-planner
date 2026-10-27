import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { Brand } from "@/components/ui/brand";
import { handleFor } from "@/lib/builds/queries";
import { isAdmin } from "@/lib/users/admin";
import { playthroughsOn } from "@/lib/features";
import { looksLikeBot } from "@/lib/moderation/bot";
import { countOpenReview } from "@/lib/moderation/review";
import { AccountMenu } from "./account-menu";
import { SearchPalette } from "./search/search-palette";
import { SiteNav } from "./site-nav";
import styles from "./site-header.module.css";

/**
 * The site's header: the brand (to Browse builds), Builds and Guide (WO-66), New build, and the
 * account menu, or Sign in. My builds and My page are in the avatar's menu.
 */
export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const handle = user?.id ? await handleFor(user.id).catch(() => null) : null;
  // Admins see how much waits on the review list (WO-40).
  const review = user?.id && (await isAdmin(user.id).catch(() => false)) ? await countOpenReview().catch(() => 0) : null;
  const newLabel = playthroughsOn() ? "New character" : "New build";

  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <span className={styles.left}>
          <Brand />
          <SiteNav />
        </span>
        <div className={styles.actions}>
          <SearchPalette />
          {/* A build and a playthrough are one character (WO-114): New character, while playthroughs are on. */}
          <Link href="/new" className={`btn btn-primary ${styles.newBuild}`} aria-label={newLabel}>
            <span className={styles.newIcon} aria-hidden="true">
              +
            </span>
            <span className={styles.newLabel}>{newLabel}</span>
          </Link>
          {user ? (
            <AccountMenu
              name={user.name ?? ""}
              image={user.image ?? null}
              handle={handle}
              review={review}
              signOut={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}

export function SignInButton({ redirectTo, className = "btn", label }: { redirectTo?: string; className?: string; label?: React.ReactNode }) {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        // Vercel BotID on sign-in (WO-40).
        if (await looksLikeBot()) return;
        const to = String(formData.get("redirectTo") ?? "/");
        await signIn("discord", { redirectTo: to.startsWith("/") ? to : "/" });
      }}
    >
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
      <button className={className} type="submit">
        {label ?? (
          <>
            <span className={styles.wide}>Sign in with Discord</span>
            <span className={styles.narrow}>Sign in</span>
          </>
        )}
      </button>
    </form>
  );
}
