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
        port: "8000",
        pathname: "**",
      },
    ],
  },
  env: {
    BACKEND_URL: "http://localhost",
    BACKEND_PORT: 8000,
  },
};

export default nextConfig;