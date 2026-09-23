import Image from "next/image";

export default function Home() {
  return (
    <main
      className="relative flex w-full items-center justify-center overflow-hidden py-10"
      style={{
        minHeight: "70vh",
        background: "linear-gradient(180deg, #05060f 0%, #0b0d1f 60%, #05060f 100%)",
      }}
    >
      <div className="absolute right-6 top-6 rounded border border-white/50 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/90">
        Menu
      </div>

      {/* Felirat — alsó réteg */}
      <h1
        className="absolute w-full max-w-5xl px-4 text-center font-black uppercase leading-[0.95] tracking-tight text-white"
        style={{ fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)", zIndex: 0 }}
      >
        <span className="block">
          <span className="text-[#3d4bd6]">E</span>VERY GREAT TR
          <span className="text-[#3d4bd6]">I</span>CK
        </span>
        <span className="block">HAS THREE</span>
        <span className="block">
          <span className="text-[#3d4bd6]">PARTS.</span>YOUR{" "}
          <span className="text-[#3d4bd6]">W</span>EBSITE
        </span>
        <span className="block">IS THE PRESTIGE.</span>
      </h1>

      {/* Átlátszó hátterű kivágás — felső réteg, eltakarja a mögötte lévő szöveget */}
      <div
        className="relative"
        style={{ width: "320px", height: "530px", zIndex: 10 }}
      >
        <Image
          src="/images/hero-en.png"
          alt="Portré kivágás"
          fill
          priority
          sizes="320px"
          className="object-contain object-bottom"
        />
      </div>
    </main>
  );
}
