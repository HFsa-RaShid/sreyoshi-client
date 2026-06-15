/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // আনস্প্ল্যাশ ইমেজের জন্য
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ক্লাউডিনারি ইমেজের জন্য (ভবিষ্যতে লাগবে)
      },
    ],
  },
};

export default nextConfig;