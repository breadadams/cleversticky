const esbuild = require("esbuild");

const baseConfig = {
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  minify: true,
  target: ["esnext"]
};

// Build IIFE format
esbuild
  .build({ ...baseConfig, outExtension: { ".js": ".iife.js" } })
  .catch(() => process.exit(1));

// Build ECMAScript Module format
esbuild.build({ ...baseConfig, format: "esm" }).catch(() => process.exit(1));
