import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Foto recortada em arco: topo em semicírculo, base reta, proporção 4:5.
 * `withArc` desenha a linha dourada concêntrica (exclusiva do hero).
 */
export function ArchPhoto({
  src,
  alt,
  sizes,
  preload = false,
  withArc = false,
  objectPosition = "50% 0%",
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  withArc?: boolean;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] bg-mist">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          fetchPriority={preload ? "high" : undefined}
          quality={85}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>

      {withArc && (
        // Caixa 14px maior que a foto de cada lado, com proporção 2:1.
        // Sem viewBox, as unidades são pixels reais: o traço fica com 1.5px
        // em qualquer largura. r = 63.2456% da diagonal normalizada
        // (sqrt((w² + h²) / 2)) equivale a exatamente metade da largura,
        // então o círculo é concêntrico ao topo da foto.
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute -top-[14px] -left-[14px] aspect-[2/1] w-[calc(100%+28px)] overflow-visible"
        >
          <circle
            cx="50%"
            cy="100%"
            r="63.2456%"
            pathLength={1}
            fill="none"
            stroke="var(--sun)"
            strokeWidth={1.5}
            strokeLinecap="round"
            className="hero-arc-path"
          />
        </svg>
      )}
    </div>
  );
}
