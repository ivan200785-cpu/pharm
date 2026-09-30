import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// BASE задаётся в CI (/<имя-репозитория>/); локально — корень
export default defineConfig({
  base: process.env.BASE ?? "/",
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
