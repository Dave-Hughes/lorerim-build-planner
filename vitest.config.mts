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
  test: { include: ["src/**/*.test.ts"], exclude: ["e2e/**", "node_modules/**"] },
});
