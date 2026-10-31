import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // SWC instead of esbuild so decorator metadata is emitted, which Nest's DI needs.
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
  },
});
