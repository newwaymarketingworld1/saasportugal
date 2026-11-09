import Image from "next/image";
import Link from "next/link";

type Props = {
  /** "light" = logo branca (para fundo preto). "dark" = logo preta (para fundo claro). */
  tone?: "light" | "dark";
  href?: string;
  size?: "md" | "lg";
};

// Dimensões reais dos arquivos em /public/brand (proporção 724 x 384).
const RATIO = { width: 724, height: 384 };

/** Logomarca NewWay Marketing World (arquivos em public/brand/). */
export function Brand({ tone = "light", href = "/", size = "md" }: Props) {
  const src = tone === "light" ? "/brand/logo-white.png" : "/brand/logo-black.png";
  const sizeClass = size === "lg" ? "h-28 sm:h-36" : "h-20 sm:h-24";
  return (
    <Link
      href={href}
      className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      aria-label="NewWay Marketing World"
    >
      <Image
        src={src}
        alt="NewWay Marketing World"
        width={RATIO.width}
        height={RATIO.height}
        priority
        className={`${sizeClass} w-auto`}
      />
    </Link>
  );
}
