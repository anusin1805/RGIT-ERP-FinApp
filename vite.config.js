import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      // FIX: Point "@" directly to "src", not "client/src"
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  // FIX: Set root to "." (current directory) instead of "client"
  root: ".", 
  build: {
    // FIX: Output to "dist" relative to the root
    outDir: "dist",
    emptyOutDir: true,
  },
});
