import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

// The cloud workspace ships Chromium at a fixed path; elsewhere Playwright downloads its own.
const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const port = 3123;
/** A second server with WO-81's launch switches off: the launch view, for wo81.spec.ts. */
const launchPort = 3125;
/** A third with WO-84's coming soon page on, for wo84-soon.spec.ts. */
const soonPort = 3127;

/** Every test starts with Tapps' tours done (WO-61); the tour tests start from a fresh browser. */
export const TOURS_DONE = {
  cookies: [],
  origins: [port, launchPort, soonPort].map((p) => ({
    origin: `http://localhost:${p}`,
    localStorage: [
      { name: "planner.tour.reader", value: "done" },
      { name: "planner.tour.author", value: "done" },
    ],
  })),
};

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
    storageState: TOURS_DONE,
  },
  projects: [
    // Story and the site guide on (WO-81), so their tests keep running.
    { name: "all", testIgnore: /wo81-launch\.spec\.ts|wo84-soon\.spec\.ts/ },
    // Both off, as they launch.
    { name: "launch", testMatch: /wo81-launch\.spec\.ts/, use: { baseURL: `http://localhost:${launchPort}` } },
    // The coming soon page in front of everything (WO-84).
    { name: "soon", testMatch: /wo84-soon\.spec\.ts/, use: { baseURL: `http://localhost:${soonPort}` } },
  ],
  webServer: [port, launchPort, soonPort].map((p) => ({
    // Run `npm run build` first; this serves the production build.
    command: `npx next start -p ${p}`,
    url: `http://localhost:${p}/b/sample`,
    reuseExistingServer: true,
    timeout: 60_000,
    // PLANNER_TEST_VERSIONS registers the test-only older LoreRim version (src/lib/rules/__fixtures__/test-version.ts).
    // ADMIN_DISCORD_IDS: the seeded test author is an admin (e2e/seed.ts, WO-39).
    // SAMPLE_BUILD_ID: the first visit's sample build (WO-80), the seeded Iriel (gear, spells, a guide).
    // FEATURE_STORY, FEATURE_SITE_GUIDE: WO-81's switches, on for the main server, off for the launch one.
    env: {
      AUTH_TRUST_HOST: "true",
      PLANNER_TEST_VERSIONS: "1",
      ADMIN_DISCORD_IDS: "e2e-discord-admin-0001",
      SAMPLE_BUILD_ID: "e2eyrye7q2",
      FEATURE_STORY: p === port ? "on" : "off",
      FEATURE_SITE_GUIDE: p === port ? "on" : "off",
      // FEATURE_COMING_SOON: on for the third server only.
      FEATURE_COMING_SOON: p === soonPort ? "on" : "off",
    },
  })),
});
