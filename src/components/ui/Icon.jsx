// Egyszerű vonalas ikonok (24×24, stroke = currentColor).
const paths = {
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
  package: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 6-7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  shield: <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  steps: <path d="M4 20h5v-5h5v-5h5V5" />,
  tag: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5v.7M12 17h.01" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  // Ikon-sín (referencia: babér / rakéta / lombik / agy / idézet)
  laurel: (
    <>
      <path d="M8 20c-3.2-1.8-5-5.2-4.2-9.8M16 20c3.2-1.8 5-5.2 4.2-9.8" />
      <path d="M5 16.5 2.8 15.8M4 13.2l-2-1.2M3.9 9.8 2.6 7.8M19 16.5l2.2-.7M20 13.2l2-1.2M20.1 9.8l1.3-2" />
      <path d="M9.5 21h5" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2.5c2.8 2.2 4.2 5.4 4.2 9.3L14.4 16H9.6l-1.8-4.2c0-3.9 1.4-7.1 4.2-9.3Z" />
      <circle cx="12" cy="9" r="1.7" />
      <path d="M9.6 16 7.5 19.8l2.9-1.1M14.4 16l2.1 3.8-2.9-1.1M12 18v3" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3h5M10.5 3v6.2L5 18.4A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.6-2.6l-5.5-9.2V3" />
      <path d="M7.4 15h9.2" />
    </>
  ),
  brain: (
    <>
      <path d="M12 5.2a3 3 0 0 0-5.4-1.6A3 3 0 0 0 4.2 8a3.2 3.2 0 0 0 .4 5.6A3 3 0 0 0 7.5 19a3 3 0 0 0 4.5.6" />
      <path d="M12 5.2a3 3 0 0 1 5.4-1.6A3 3 0 0 1 19.8 8a3.2 3.2 0 0 1-.4 5.6A3 3 0 0 1 16.5 19a3 3 0 0 1-4.5.6" />
      <path d="M12 5.2v14.4" />
    </>
  ),
  send: (
    <>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
    </>
  ),
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14.2a4.4 4.4 0 0 0 7 0" />
      <path d="M9 9.6v.6M15 9.6v.6" strokeWidth="2.2" />
    </>
  ),
  quote: (
    <>
      <path d="M4 4.5h16v11.5H9.5L4 20.5v-16Z" />
      <path d="M9.2 8.2v3.2a1.4 1.4 0 0 1-1.4 1.4M14.8 8.2v3.2a1.4 1.4 0 0 1-1.4 1.4" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
    </>
  ),
  facebook: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M15.5 8h-1.5a2 2 0 0 0-2 2v11M9.5 13h5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.01" />
    </>
  ),
};

export default function Icon({
  name,
  className = "size-5",
  strokeWidth = 1.6,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
