import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { include: ["studio/**/*.test.ts", "bin/**/*.test.mjs"] },
});
