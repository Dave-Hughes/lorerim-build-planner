import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { Avatar } from "@/components/ui/avatar";
import { Brand } from "@/components/ui/brand";
import styles from "./site-header.module.css";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <Brand />
        <nav aria-label="Main" className={styles.nav}>
          <Link href="/">Browse builds</Link>
          {user && <Link href="/me">My builds</Link>}
          <Link href="/new">New build</Link>
        </nav>
        {user ? (
          <form
            className={styles.account}
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <span className={styles.who}>
              <Avatar name={user.name ?? ""} image={user.image ?? null} />
              <span>{user.name}</span>
            </span>
            <button className="btn btn-sm" type="submit">
              Sign out
            </button>
          </form>
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}

export function SignInButton({ redirectTo, className = "btn", label = "Sign in with Discord" }: { redirectTo?: string; className?: string; label?: string }) {
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
        {label}
      </button>
    </form>
  );
}
