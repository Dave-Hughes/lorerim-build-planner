import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Route handlers and server modules import it; in a unit test it has nothing to guard (WO-88).
      "server-only": fileURLToPath(new URL("./vitest.server-only.ts", import.meta.url)),
    },
  },
  // Playthroughs are held back from launch (WO-182) and off in the environment by default; their code and tests keep running with the switch on,
  // and the launch tests (wo182.test.ts) ask for the off case themselves.
  test: { include: ["src/**/*.test.ts"], exclude: ["e2e/**", "node_modules/**"], env: { FEATURE_PLAYTHROUGHS: process.env.FEATURE_PLAYTHROUGHS ?? "on" } },
});
