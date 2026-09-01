import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The site depends on the package one directory up (`seedicon: file:..`),
  // so there are two lockfiles in play and Next.js cannot tell on its own
  // which directory is the real root. Left to guess, it warns on every
  // build and can trace the wrong tree when bundling for deployment.
  // Pointing it at the repository root settles both.
  outputFileTracingRoot: fileURLToPath(new URL("..", import.meta.url)),
};

export default nextConfig;
