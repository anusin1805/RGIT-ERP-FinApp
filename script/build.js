import { build } from "vite";
import { build as esbuild } from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

async function main() {
  // 1. Clean dist directory
  const dist = path.join(root, "dist");
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
  }

  // 2. Build Client (Vite)
  console.log("building client...");
  await build({
    root,
    build: {
      outDir: "dist/public",
      emptyOutDir: true,
    },
  });

  // 3. Build Server (Esbuild)
  console.log("building server...");
  await esbuild({
    entryPoints: [path.join(root, "server/index.js")], // Now points to .js
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: path.join(root, "dist/index.js"),
    format: "esm",
    packages: "external", // Don't bundle node_modules
    loader: { ".js": "jsx" },
  });

  console.log("Build complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
