import Link from "next/link";

const variants = {
  primary:
    "bg-accent text-on-accent glow-accent hover:bg-accent-hover",
  outline:
    "border border-paper/25 text-paper hover:border-paper/60 hover:bg-paper/5",
  dark: "bg-night text-paper hover:bg-night-3",
};

// Méret = térköz; a betűméret skála-lépcső (base / lg).
const sizes = {
  sm: "px-4 py-2.5 text-base",
  md: "px-6 py-3.5 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${variants[variant]} ${sizes[size]} ${className}`;

  // Belső útvonal → kliens-navigáció; külső / mailto → sima <a>.
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}
