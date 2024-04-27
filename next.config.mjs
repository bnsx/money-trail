/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "flagcdn.com",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/trail",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
