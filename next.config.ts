import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  // Prevent hot reload during file uploads in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.next', '**/notebooklm.db*'],
      }
    }
    return config
  },
}

export default nextConfig