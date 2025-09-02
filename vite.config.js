import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// const URL = process.env.VITE_REMOTE_API;

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        // secure: false,
      },
    },
  },
  plugins: [TanStackRouterVite(), react()],
});
