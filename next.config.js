/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@genkit-ai/ai', '@genkit-ai/core', '@genkit-ai/googleai']
  },
  webpack: (config) => {
    config.ignoreWarnings = [/googleai\/gemini-pro-vision/]
    return config
  }
}

module.exports = nextConfig