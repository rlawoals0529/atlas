import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// UI-only preview for machines whose local workerd predates production's
// compatibility date. Only public product media is proxied to production.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api/media/": {
        target: "https://atlas.rlawoals0529.workers.dev",
        changeOrigin: true,
      },
    },
  },
});
