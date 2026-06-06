import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'avatar.linear.app',
      'lh3.googleusercontent.com',  // Google avatarları
    ],
  },
}

export default nextConfig