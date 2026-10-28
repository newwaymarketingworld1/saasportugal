import type { ReactNode } from "react";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./whatsapp-icon";

type Variant = "primary" | "inverse" | "compact";

const variants: Record<Variant, string> = {
  primary: "min-h-[52px] px-7 gap-3 bg-sea text-paper hover:bg-sea-deep",
  inverse: "min-h-[52px] px-7 gap-3 bg-paper text-ink hover:bg-mist",
  compact: "min-h-12 px-5 gap-2.5 bg-sea text-paper hover:bg-sea-deep",
};

export function WhatsAppButton({
  variant = "primary",
  children,
  className,
  id,
  onClick,
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}) {
  return (
    <a
      id={id}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      data-whatsapp=""
      className={cn(
        "inline-flex items-center justify-center rounded-full text-center",
        "font-sans font-semibold text-[1.0625rem] leading-none tracking-[0.005em]",
        "transition-colors duration-150 ease-out",
        variants[variant],
        className,
      )}
    >
      <WhatsAppIcon size={variant === "compact" ? 18 : 20} className="shrink-0" />
      <span className="py-1">{children}</span>
    </a>
  );
}
