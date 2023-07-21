/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["s3.amazonaws.com", "miuve.s3.amazonaws.com"],
      },
    env: {
      AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }; 
module.exports = nextConfig
