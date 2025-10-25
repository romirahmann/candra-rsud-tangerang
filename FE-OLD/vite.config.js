import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/RSUD-KAB-TANGERANG/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 76,
  },
});
