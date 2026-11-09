import Link from "next/link";

type Props = {
  /** "light" = texto branco (fundo preto). "dark" = texto preto (fundo claro). */
  tone?: "light" | "dark";
  href?: string;
  size?: "md" | "lg";
};

/** Wordmark: NEWWAY (Azonix) + MARKETING WORLD (Montserrat). */
export function Brand({ tone = "light", href = "/", size = "md" }: Props) {
  const color = tone === "light" ? "text-white" : "text-ink";
  const big = size === "lg";
  return (
    <Link
      href={href}
      className={`inline-flex flex-col leading-none ${color} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand`}
      aria-label="NewWay Marketing World"
    >
      <span
        className={`font-display tracking-wordmark ${big ? "text-4xl sm:text-5xl" : "text-xl sm:text-2xl"}`}
      >
        NEW<span className="text-brand">WAY</span>
      </span>
      <span
        className={`mt-1.5 font-sans font-semibold tracking-widest2 ${big ? "text-[0.7rem] sm:text-xs" : "text-[0.5rem] sm:text-[0.6rem]"}`}
      >
        MARKETING WORLD
      </span>
    </Link>
  );
}
