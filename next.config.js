/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
            port: '',
            // pathname: '/PokeAPI',
          },
          {
            protocol: 'https',
            hostname: 'static.wikia.nocookie.net',
            port: '',
          },
        ],
      },
}

module.exports = nextConfig