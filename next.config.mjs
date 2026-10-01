/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev: telefonról / más gépről (LAN IP) is betöltődjön a JS és a HMR.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  // A régi webvulcano.hu URL-jei (Google-index) → új helyük.
  async redirects() {
    return [
      { source: "/projektek", destination: "/#munkaim", permanent: true },
      { source: "/projektek/:path*", destination: "/#munkaim", permanent: true },
    ];
  },
};

export default nextConfig;
