import { describe, expect, it } from "vitest";
import { assertDatabaseMatchesEnvironment, environmentOfUrl } from "./environments";

const url = (endpoint: string, pooled = true) =>
  `postgresql://user:pw@${endpoint}${pooled ? "-pooler" : ""}.c-13.us-east-1.aws.neon.tech/lorerim?sslmode=require`;
const PROD = url("ep-polished-snow-b7a1ykkv");
const STAGING = url("ep-billowing-heart-b713fgc4");
const DEV = url("ep-rapid-wildflower-b7xg0gjd", false);

describe("environmentOfUrl", () => {
  it("recognizes each branch, pooled or direct", () => {
    expect(environmentOfUrl(PROD)).toBe("production");
    expect(environmentOfUrl(STAGING)).toBe("staging");
    expect(environmentOfUrl(DEV)).toBe("development");
    expect(environmentOfUrl(url("ep-someone-else"))).toBeNull();
    expect(environmentOfUrl("not a url")).toBeNull();
  });
});

describe("assertDatabaseMatchesEnvironment", () => {
  const run = (env: Record<string, string>) => () => assertDatabaseMatchesEnvironment(env as NodeJS.ProcessEnv);

  it("allows each environment its own database", () => {
    expect(run({ VERCEL_ENV: "production", DATABASE_URL: PROD })).not.toThrow();
    expect(run({ VERCEL_ENV: "preview", DATABASE_URL: STAGING })).not.toThrow();
    expect(run({ DATABASE_URL: DEV })).not.toThrow();
  });

  it("refuses production from a laptop or a preview", () => {
    expect(run({ DATABASE_URL: PROD })).toThrow(/development environment.*production database/);
    expect(run({ VERCEL_ENV: "preview", DATABASE_URL: PROD })).toThrow(/staging/);
  });

  it("refuses a production deploy pointed at another database", () => {
    expect(run({ VERCEL_ENV: "production", DATABASE_URL: STAGING })).toThrow();
    expect(run({ VERCEL_ENV: "production", DATABASE_URL: DEV })).toThrow();
  });

  it("refuses when DATABASE_URL is missing or unknown", () => {
    expect(run({})).toThrow(/not set/);
    expect(run({ DATABASE_URL: url("ep-someone-else") })).toThrow(/unknown database/);
  });
});
