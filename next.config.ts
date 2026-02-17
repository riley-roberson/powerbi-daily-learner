import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/powerbi-daily-learner" : "",
  assetPrefix: isProd ? "/powerbi-daily-learner/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
