/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'watchlab-s3.s3.us-east-1.amazonaws.com',
    ],
  },

  i18n: {
    locales: ['en', 'ko', 'jp', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};
