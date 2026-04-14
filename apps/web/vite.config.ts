import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3003,
  },
  plugins: [
    tanstackStart({
      spa: { enabled: true },
    }),
    viteTsConfigPaths(),
  ],
});
