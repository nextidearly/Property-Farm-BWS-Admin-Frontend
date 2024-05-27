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
    BACKEND_PORT: "3001",
    TREASURY: "bc1paqrxew82mtlrfd4zfurt0evwadjj7w38rzte7nmzygcqkwq3qa7qcn5edy",
  },
};

export default nextConfig;
