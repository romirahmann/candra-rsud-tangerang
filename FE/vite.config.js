import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/RSUD-KAB-TANGERANG/",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 76,
  },
});
