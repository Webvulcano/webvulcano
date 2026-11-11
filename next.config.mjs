/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev: telefonról / más gépről (LAN IP) is betöltődjön a JS és a HMR.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  // 75: alap; 90: hero portré (arc, finom átmenetek – 75-ön pixeles)
  images: { qualities: [75, 90] },
  // Személyre szabott útmutató-PDF: az alap-PDF és a betűtípusok menjenek a függvénnyel.
  outputFileTracingIncludes: {
    // PageSpeed-összefoglaló PDF: az Inter betűtípusok menjenek a függvénnyel.
    "/api/pagespeed/pdf": ["./content/pagespeed-pdf/fonts/*.ttf"],
    "/api/utmutato": [
      "./content/utmutato/base.pdf",
      "./content/utmutato/fills.json",
      "./content/utmutato/fonts/embed/*.ttf",
    ],
  },
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
