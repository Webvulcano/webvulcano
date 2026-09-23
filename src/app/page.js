import Image from "next/image";

export default function Home() {
  return (
    <main
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #05060f 0%, #0b0d1f 60%, #05060f 100%)",
      }}
    >
      <div className="absolute right-6 top-6 rounded border border-white/50 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/90">
        Menu
      </div>

      {/* Átlátszó hátterű kivágás — alul kezdődik, nagyobb méret */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: "520px", height: "90vh", zIndex: 0 }}
      >
        <Image
          src="/images/hero-en.png"
          alt="Portré kivágás"
          fill
          priority
          sizes="520px"
          className="object-contain object-bottom"
        />
      </div>

      {/* Felirat — felső réteg, előttem, blend-módban átlátszik rajtam */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
        <h1
          className="w-full max-w-5xl px-4 text-center font-black uppercase leading-[0.95] tracking-tight text-white mix-blend-difference"
          style={{ fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)" }}
        >
          <span className="block">EVERY GREAT TRICK</span>
          <span className="block">HAS THREE</span>
          <span className="block">PARTS. YOUR WEBSITE</span>
          <span className="block">IS THE PRESTIGE.</span>
        </h1>
      </div>
    </main>
  );
}
