"use client";

import { useState } from "react";
import Image from "next/image";
import FadeImage from "@/components/ui/FadeImage";
import ParallaxGroup from "@/components/ui/ParallaxGroup";
import hero from "@/assets/hero.webp";

// Parallax-mélységek (--mx/--my: -1…1, ParallaxGroup írja).
const shadowDepth = { transform: "translate3d(calc(var(--mx, 0) * -6px), calc(var(--my, 0) * -4px), 0)" };
const portraitDepth = { transform: "translate3d(calc(var(--mx, 0) * 10px), calc(var(--my, 0) * 6px), 0)" };

const sizes = "(min-width: 1024px) 38vw, 80vw";

// Hero portré: betöltés után áttűnik (FadeImage), és csak ekkor úszik be a vetett árnyék –
// nincs placeholder-csere, nincs villanás.
export default function HeroPortrait() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ParallaxGroup className="relative h-[520px] sm:h-[640px] lg:h-full">
      {/* z-[5] vetett árnyék */}
      <div aria-hidden="true" className="absolute inset-0 z-[5]" style={shadowDepth}>
        {loaded && (
          <Image
            src={hero}
            alt=""
            quality={90}
            sizes={sizes}
            className="fade-up absolute bottom-0 left-[46%] h-[90%] w-auto max-w-none -translate-x-1/2 opacity-25 blur-xl brightness-0 lg:left-[54%]"
            style={{ "--d": "150ms" }}
          />
        )}
      </div>

      {/* z-10 portré */}
      <div className="absolute inset-0 z-10" style={portraitDepth}>
        <FadeImage
          src={hero}
          alt="Bognár Lehel, weboldalfejlesztő"
          quality={90}
          preload
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          className="absolute bottom-0 left-[40%] h-[92%] w-auto max-w-none -translate-x-1/2 lg:left-[48%]"
        />
      </div>
    </ParallaxGroup>
  );
}
