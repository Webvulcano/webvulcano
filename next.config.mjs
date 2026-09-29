/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev: telefonról / más gépről (LAN IP) is betöltődjön a JS és a HMR.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;
