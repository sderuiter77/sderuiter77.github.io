/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // This basePath should match your GitHub repository name
  // For example, if your repo is "username/mexen-game", use "/mexen-game"
  // Leave it as an empty string for now and update it when you create your repository
  basePath: '',
  trailingSlash: true,
};

export default nextConfig;
