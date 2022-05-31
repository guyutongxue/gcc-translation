import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    json(),
  ],
});
