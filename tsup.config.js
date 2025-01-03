import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: "esm",
  ignoreWatch: "./yarn/**/*",
  minify: true,
  treeshake: true,
});
