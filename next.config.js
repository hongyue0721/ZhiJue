/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone' 在 Dockerfile 中通过环境变量启用
  // 本地开发不需要 standalone 模式
  ...(process.env.NEXT_BUILD_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
}

module.exports = nextConfig
