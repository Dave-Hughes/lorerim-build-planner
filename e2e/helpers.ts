import type { BrowserContext } from "@playwright/test";
import { OTHER_SESSION_TOKEN, TEST_SESSION_TOKEN } from "./seed";

/** Signs the context in as the test author (or, with `other`, as Someone Else), the way Auth.js would after Discord. */
export async function signIn(context: BrowserContext, who: "author" | "other" = "author") {
  const value = who === "other" ? OTHER_SESSION_TOKEN : TEST_SESSION_TOKEN;
  await context.addCookies([{ name: "authjs.session-token", value, domain: "localhost", path: "/" }]);
}
