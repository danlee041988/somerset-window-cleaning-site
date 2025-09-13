/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for easy preview and static hosting
  // All current routes are static and compatible.
  output: 'export',
  images: {
    // Ensure Next/Image works in static export if used later
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
}

export default nextConfig
