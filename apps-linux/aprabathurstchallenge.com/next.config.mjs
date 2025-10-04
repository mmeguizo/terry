/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true
  },
}

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   env: {
//     SITE_SLUG: process.env.SITE_SLUG,
//     SITE_DOMAIN: process.env.SITE_DOMAIN || 'http://localhost:3000',
//     STRAPI_URL: process.env.STRAPI_URL,
//     STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN, // Add this line
//   },
//   images: {
//     domains: [
//       // Extract domain from STRAPI_URL for image optimization
//       new URL(process.env.STRAPI_URL || 'http://localhost:1337').hostname,
//       'images.pexels.com',
//       'encrypted-tbn0.gstatic.com',
//       'corp.formula1.com',
//       'assets.maz.tv',
//       'logos-world.net',
//       'wp.logos-download.com',
//       'upload.wikimedia.org',
//       'wakefield300.com.au',
//     ],
//   },
// };

// export default nextConfig;
