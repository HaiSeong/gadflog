/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    optimizeFonts: false,
    compiler: {
        removeConsole: false,
    },
    experimental: {
        appDir: true,
    },
    transpilePackages: ['@xyflow/react'],
    reactStrictMode: true,
}

module.exports = nextConfig
