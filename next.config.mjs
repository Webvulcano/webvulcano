/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev: telefonról / más gépről (LAN IP) is betöltődjön a JS és a HMR.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  // 75: alap; 90: hero portré (arc, finom átmenetek – 75-ön pixeles)
  images: { qualities: [75, 90] },
  // A régi webvulcano.hu URL-jei (Google-index) → új helyük.
  async redirects() {
    return [
      // Kanonikus domain: webvulcano.hu (www nélkül). Vercelben NE állíts be fordított (→ www) redirectet, mert hurok lesz.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.webvulcano.hu" }],
        destination: "https://webvulcano.hu/:path*",
        permanent: true,
      },
      { source: "/projektek", destination: "/#munkaim", permanent: true },
      { source: "/projektek/:path*", destination: "/#munkaim", permanent: true },
    ];
  },
};

export default nextConfig;
