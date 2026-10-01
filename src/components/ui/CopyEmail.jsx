"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/data/site";

// Email-cím gomb: kattintásra vágólapra másol (fallback: mailto), „Kimásolva” buborékkal.
export default function CopyEmail({ icon = true, className = "text-base" }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(site.email);
      ok = true;
    } catch {
      // régi / korlátozott böngészők: rejtett textarea + execCommand
      const ta = document.createElement("textarea");
      ta.value = site.email;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {}
      ta.remove();
    }
    if (!ok) {
      window.location.href = `mailto:${site.email}`;
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copyEmail}
      aria-label={`${site.email} – kattints a másoláshoz`}
      className={`group relative inline-flex items-center gap-2.5 transition-colors duration-300 ${className} ${
        copied ? "text-highlight" : "text-paper/70 hover:text-paper"
      }`}
    >
      {/* ikon: boríték ↔ másolás, forgó-skálázó csere */}
      {icon && (
        <span className="relative grid size-5 place-items-center">
          <Icon
            name="mail"
            className={`absolute size-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              copied
                ? "scale-0 -rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          />
          <Icon
            name="copy"
            className={`absolute size-5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              copied
                ? "scale-100 rotate-0 opacity-100"
                : "scale-0 rotate-90 opacity-0"
            }`}
          />
        </span>
      )}
      <span className="relative">
        {site.email}
        {/* aláhúzás, ami balról jobbra végigfut másoláskor */}
        <span
          aria-hidden="true"
          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-highlight transition-transform duration-500 ease-out ${
            copied ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </span>
      <span className="text-xs text-paper/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {copied ? "" : "másolás"}
      </span>

      {/* felúszó „Kimásolva” buborék */}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email-cím kimásolva" : ""}
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-10 left-7 rounded-full bg-highlight px-3 py-1 text-xs font-semibold whitespace-nowrap text-night shadow-[0_8px_24px_-8px_var(--highlight)] transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          copied
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-90 opacity-0"
        }`}
      >
        Kimásolva ✓
        <span className="absolute -bottom-1 left-4 size-2 rotate-45 bg-highlight" />
      </span>
    </button>
  );
}
