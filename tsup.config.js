import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  splitting: false,
  sourcemap: true,
  publicDir: true,
  format: "esm",
  ignoreWatch: "./yarn/**/*",
  minify: true,
});
