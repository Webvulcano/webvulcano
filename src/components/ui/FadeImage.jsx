"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// next/image, ami csak betöltés után, egy sima áttűnéssel jelenik meg (nincs placeholder-csere,
// nincs villanás). JS nélkül azonnal látszik – a rejtés a `.js` osztályhoz kötött (globals.css).
export default function FadeImage({ alt, className = "", onLoad, ...props }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Cache-ből a kép a hydration előtt is betölthet – ilyenkor az onLoad már nem fut le.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth) {
      setLoaded(true);
      onLoad?.({ currentTarget: img, target: img });
    }
    // csak mountkor kell
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Image
      {...props}
      ref={ref}
      alt={alt}
      data-loaded={loaded || undefined}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`fade-image ${className}`}
    />
  );
}
