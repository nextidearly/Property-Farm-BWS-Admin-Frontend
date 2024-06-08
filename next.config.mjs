/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['0dad-95-217-105-21.ngrok-free.app'], // Add the hostname here instead of using remotePatterns
  },
  env: {
    BACKEND_URL: 'https://0dad-95-217-105-21.ngrok-free.app',
    BACKEND_PORT: '',
    TREASURY: 'bc1pk7jgjmmsxgu7a9dvla8r4pxs6v6cu9jt6mjzkzlr0kzurz9ym73s4gulcs',
  },
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }
    return config;
  },
};

export default nextConfig;
