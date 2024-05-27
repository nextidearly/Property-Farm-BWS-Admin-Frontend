/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["95.217.105.21"], // Add the hostname here instead of using remotePatterns
  },
  env: {
    BACKEND_URL: "http://95.217.105.21",
    BACKEND_PORT: "8080",
    TREASURY: "bc1paqrxew82mtlrfd4zfurt0evwadjj7w38rzte7nmzygcqkwq3qa7qcn5edy",
  },
};

export default nextConfig;
