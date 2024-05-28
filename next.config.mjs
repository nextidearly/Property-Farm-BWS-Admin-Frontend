/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["4c06-95-217-105-21.ngrok-free.app"], // Add the hostname here instead of using remotePatterns
  },
  env: {
    BACKEND_URL: "https://4c06-95-217-105-21.ngrok-free.app",
    BACKEND_PORT: "",
    TREASURY: "bc1paqrxew82mtlrfd4zfurt0evwadjj7w38rzte7nmzygcqkwq3qa7qcn5edy",
  },
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    if (!options.isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }
    return config;
  },
};

export default nextConfig;
