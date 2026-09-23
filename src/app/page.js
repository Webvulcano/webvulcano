import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex w-full items-center justify-center overflow-hidden bg-black py-10" style={{ minHeight: "60vh" }}>
      {/* Kép konténer mérete itt állítható — width/height */}
      <div className="relative" style={{ width: "320px", height: "420px" }}>
        <Image
          src="/images/hero-en.jpg"
          alt="Portré háttérkép"
          fill
          priority
          sizes="320px"
          className="object-cover object-top"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="absolute right-3 top-3 rounded border border-white/50 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white/90">
          Menu
        </div>

        <div className="absolute inset-0 flex items-end justify-center px-2 pb-4">
          <h1
            className="w-full text-center font-black uppercase leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
          >
            <span className="block">
              <span className="text-[#171c5e]">E</span>VERY GREAT TR
              <span className="text-[#171c5e]">I</span>CK
            </span>
            <span className="block">HAS THREE</span>
            <span className="block">
              <span className="text-[#171c5e]">PARTS.</span>YOUR{" "}
              <span className="text-[#171c5e]">W</span>EBSITE
            </span>
            <span className="block">IS THE PRESTIGE.</span>
          </h1>
        </div>
      </div>
    </main>
  );
}
