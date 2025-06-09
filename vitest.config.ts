import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "react-native": "react-native-web",
    },
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
  define: {
    __DEV__: true,
  },
});
