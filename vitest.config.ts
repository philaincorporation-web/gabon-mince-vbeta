import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Configuration de test autonome (sans les plugins TanStack/Lovable de vite.config.ts).
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
