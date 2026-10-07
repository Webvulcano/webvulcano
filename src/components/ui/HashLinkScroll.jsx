"use client";

import { useEffect } from "react";

// Oldalon belüli hash-linkek (pl. „Lépjünk kapcsolatba” → /#kapcsolat) MINDEN kattintásra odagörgetnek.
// A next/link ugyanarra a hash-re másodszor nem navigál (az URL nem változik), így magától nem görgetne.
// Capture-fázisban fut, a Link saját kezelője előtt; a görgetés a html scroll-behavior/scroll-padding-top
// beállítását követi (globals.css).
export default function HashLinkScroll() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || (a.target && a.target !== "_self")) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();
      target.scrollIntoView({ block: "start" });
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
