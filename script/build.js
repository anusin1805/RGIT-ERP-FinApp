// script/build.ts
import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import path from "path";

// Dependencies to exclude from the server bundle (node_modules)
const allowlist = [
  "@google/generative-ai", "axios", "connect-pg-simple", "cors", "date-fns",
  "drizzle-orm", "drizzle-zod", "express", "express-rate-limit", "express-session",
  "jsonwebtoken", "memorystore", "multer", "nanoid", "nodemailer", "openai",
  "passport", "passport-local", "pg", "stripe", "uuid", "ws", "xlsx", "zod",
  "zod-validation-error",
];

async function buildAll() {
  // 1. Clean dist folder
  await rm("dist", { recursive, force});

  // 2. Build Frontend (React/Vite)
  console.log("building client...");
  await viteBuild();

  // 3. Build Server (Node/Express)
  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  // Exclude everything NOT in the allowlist
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.js"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals, // Don't bundle node_modules
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
