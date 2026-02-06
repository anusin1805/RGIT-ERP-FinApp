import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules (Must happen AFTER imports)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  // CHANGED: Set base to "/" for Render. 
  // (The previous "/RGIT-ERP-FinApp/" would break your site on Render)
  base: "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"), // Ensure this points to where your React components are
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  root: "client", // Ensure this points to your client folder if that's where index.html is

  build: {
    outDir: "../dist/public", // Output to dist/public so the server can find it
    emptyOutDir: true,
  },
});
