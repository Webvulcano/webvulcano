import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <Image
        src="/images/hero-en.jpg"
        alt="Portré háttérkép"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      <div className="absolute right-6 top-6 rounded border border-white/50 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/90">
        Menu
      </div>

      <div className="absolute inset-0 flex items-end justify-center px-4 pb-14 md:pb-20">
        <h1
          className="w-full max-w-6xl text-center font-black uppercase leading-[0.95] tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 6.2vw, 5.5rem)" }}
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
    </main>
  );
}
