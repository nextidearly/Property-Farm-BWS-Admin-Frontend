/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "**",
      },
    ],
  },
  env: {
    BACKEND_URL: "http://localhost",
    BACKEND_PORT: 3001,
  },
};

export default nextConfig;