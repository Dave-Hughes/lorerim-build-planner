import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

// The cloud workspace ships Chromium at a fixed path; elsewhere Playwright downloads its own.
const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const port = 3123;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
    launchOptions: { executablePath },
  },
  webServer: {
    // Run `npm run build` first; this serves the production build.
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}/b/sample`,
    reuseExistingServer: true,
    timeout: 60_000,
    // PLANNER_TEST_VERSIONS registers the test-only older LoreRim version (src/lib/rules/__fixtures__/test-version.ts).
    env: { AUTH_TRUST_HOST: "true", PLANNER_TEST_VERSIONS: "1" },
  },
});
