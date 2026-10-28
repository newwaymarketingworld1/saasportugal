"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { whatsappFloat } from "@/lib/content";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./whatsapp-icon";

/**
 * Aparece só depois que o botão do hero sai da tela (por cima) e some
 * enquanto o CTA final ou o rodapé estão visíveis.
 */
export function WhatsAppFloat() {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const endTargets = [
      document.getElementById("cta-final"),
      document.getElementById("contato"),
    ].filter((el): el is HTMLElement => Boolean(el));

    const visibleEnd = new Set<Element>();

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const endObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleEnd.add(entry.target);
        else visibleEnd.delete(entry.target);
      }
      setNearEnd(visibleEnd.size > 0);
    });

    if (heroCta) heroObserver.observe(heroCta);
    endTargets.forEach((el) => endObserver.observe(el));

    return () => {
      heroObserver.disconnect();
      endObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !nearEnd;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsappFloat.label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-whatsapp=""
      data-float=""
      className={cn(
        "fixed right-5 z-30 inline-flex size-[60px] items-center justify-center rounded-full",
        "bg-whatsapp text-white shadow-[0_6px_20px_rgba(22,52,58,0.28)]",
        "bottom-[calc(20px+env(safe-area-inset-bottom))]",
        "transition-[opacity,visibility] duration-200 ease-out",
        visible ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
