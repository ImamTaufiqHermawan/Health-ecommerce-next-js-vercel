/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image domains for Cloudinary, Unsplash, and Placeholder
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    // Disable image optimization in development to bypass SSL issues
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Environment variables validation
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },

  // API routes configuration
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  // Optimize for Vercel deployment
  experimental: {
    optimizePackageImports: ["antd"],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Disable SSL verification in development
    if (process.env.NODE_ENV === "development") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    return config;
  },
};

module.exports = nextConfig;
