import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // 1. BASE: This is required for GitHub Pages to find your CSS/JS files.
  // It matches your repository name.
  base: "/RGIT-ERP-FinApp/",

  // 2. ROOT: This tells Vite that 'index.html' is in the main folder
  root: ".",

  resolve: {
    alias: {
      // 3. ALIAS: This tells Vite that '@' means the 'src' folder in the root
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
