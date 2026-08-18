import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  exclude: [
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
    /_middlewareManifest\.js$/,
    /\.map$/,
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}
};

export default withSerwist(nextConfig);
