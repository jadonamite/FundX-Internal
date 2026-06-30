import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Pin the workspace root to this project. Without this, Next/Turbopack detects
  // ~/ as the root (a stray package-lock.json + partial @stacks node_modules live
  // there) and resolves @stacks/connect's deps from two different node_modules
  // trees, producing "module factory is not available" at wallet-connect time.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
