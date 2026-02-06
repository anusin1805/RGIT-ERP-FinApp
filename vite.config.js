import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"; // Ensure this is here
import { fileURLToPath } from "url"; // Add this

// Add this block to fix the error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // This line caused the crash! Now it works.
    },
  },
  // ... rest of your config
});
