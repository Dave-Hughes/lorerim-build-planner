import type { BrowserContext } from "@playwright/test";
import { TEST_SESSION_TOKEN } from "./seed";

/** Signs the context in as the test author, the way Auth.js would after Discord. */
export async function signIn(context: BrowserContext) {
  await context.addCookies([{ name: "authjs.session-token", value: TEST_SESSION_TOKEN, domain: "localhost", path: "/" }]);
}
