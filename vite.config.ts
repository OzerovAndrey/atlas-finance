import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages: https://ozerovandrey.github.io/atlas-finance/
export default defineConfig({
  base: "/atlas-finance/",
  plugins: [react()],
});
