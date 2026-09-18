import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    exclude: ["node_modules", "dist", ".claude"],
    coverage: {
      reporter: ["text", "json-summary", "json", "lcov"],
      reportOnFailure: true,
      exclude: [
        // shadcn/radix generated primitives — third-party wrappers
        "src/components/ui/avatar.tsx",
        "src/components/ui/button.tsx",
        "src/components/ui/dropdown-menu.tsx",
        "src/components/ui/input.tsx",
        "src/components/ui/scroll-area.tsx",
        "src/components/ui/skeleton.tsx",
        "src/components/ui/FormField.tsx",
        // type declaration files — no runtime code
        "**/*.d.ts",
        // config files
        "vite.config.ts",
        "vitest.config.ts",
        "vite-env.d.ts",
        "*.config.js",
        "*.config.ts",
        // api mock fixtures
        "src/api/mocks/**",
        // build output
        "dist/**",
        // app entry point
        "src/main.tsx",
        // barrel re-exports
        "src/stores/index.ts",
        "src/hooks/index.ts",
        "src/api/index.ts",
        // inline SVG icon components — no logic
        "src/components/icons/**",
      ],
      thresholds: {
        lines: 10,
        branches: 10,
        functions: 10,
        statements: 10,
      },
    },
  },
});
