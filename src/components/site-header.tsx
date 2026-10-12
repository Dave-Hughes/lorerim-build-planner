import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { Brand } from "@/components/ui/brand";
import { handleFor } from "@/lib/builds/queries";
import { AccountMenu } from "./account-menu";
import styles from "./site-header.module.css";

/**
 * The site's header: the brand (to Browse builds), New build, and the account menu, or Sign in.
 * No nav: Browse builds is the brand, My builds and My page are in the avatar's menu.
 */
export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const handle = user?.id ? await handleFor(user.id).catch(() => null) : null;

  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <Brand />
        <div className={styles.actions}>
          <Link href="/new" className={`btn btn-primary ${styles.newBuild}`} aria-label="New build">
            <span className={styles.newIcon} aria-hidden="true">
              +
            </span>
            <span className={styles.newLabel}>New build</span>
          </Link>
          {user ? (
            <AccountMenu
              name={user.name ?? ""}
              image={user.image ?? null}
              handle={handle}
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
