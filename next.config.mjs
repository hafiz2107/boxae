/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'hushed-gazelle-134.convex.cloud'
        }]
    }
};

export default nextConfig;
