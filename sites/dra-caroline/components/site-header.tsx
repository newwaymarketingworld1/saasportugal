"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "./whatsapp-button";

type NavLink = { id: string; label: string };

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function SiteHeader({ links }: { links: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao passar para o layout de desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // No menu mobile: fecha primeiro (libera a rolagem), depois rola até a seção.
  const onMobileLink = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setPendingTarget(id);
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[var(--header-h)] border-b transition-colors duration-150",
        scrolled
          ? "border-line bg-paper/92 backdrop-blur-md"
          : "border-transparent bg-paper/0",
      )}
    >
      <div className="container-site flex h-full items-center justify-between gap-6">
        <a href="#inicio" className="flex flex-col py-1 leading-none">
          <span className="font-serif text-[1.375rem] leading-[1.1] text-ink">{nav.brand}</span>
          <span className="t-small mt-0.5 leading-[1.3] text-muted">{nav.brandRole}</span>
        </a>

        {/* Desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="inline-flex min-h-12 items-center text-[0.9375rem] font-semibold text-ink decoration-1 underline-offset-[6px] hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <WhatsAppButton variant="compact">{nav.headerCta}</WhatsAppButton>
        </nav>

        {/* Mobile */}
        <Dialog.Root
          open={open}
          onOpenChange={setOpen}
          onOpenChangeComplete={(isOpen) => {
            if (!isOpen && pendingTarget) {
              scrollToSection(pendingTarget);
              setPendingTarget(null);
            }
          }}
        >
          <Dialog.Trigger
            aria-label={nav.menuLabel}
            className="-mr-3 inline-flex size-12 items-center justify-center rounded-full text-ink lg:hidden"
          >
            <Menu size={26} strokeWidth={1.5} aria-hidden="true" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup
              className={cn(
                "fixed inset-0 z-50 flex flex-col bg-paper text-ink",
                "transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0",
              )}
            >
              <Dialog.Title className="sr-only">Menu</Dialog.Title>
              <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between">
                <span className="flex flex-col leading-none">
                  <span className="font-serif text-[1.375rem] leading-[1.1]">{nav.brand}</span>
                  <span className="t-small mt-0.5 leading-[1.3] text-muted">{nav.brandRole}</span>
                </span>
                <Dialog.Close
                  aria-label={nav.closeLabel}
                  className="-mr-3 inline-flex size-12 items-center justify-center rounded-full"
                >
                  <X size={26} strokeWidth={1.5} aria-hidden="true" />
                </Dialog.Close>
              </div>

              <nav aria-label="Principal" className="container-site flex-1 overflow-y-auto pt-8">
                <ul className="flex flex-col gap-6">
                  {links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        onClick={(e) => onMobileLink(e, link.id)}
                        className="inline-flex min-h-12 items-center font-serif text-[2rem] leading-tight"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="container-site shrink-0 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
                <WhatsAppButton className="w-full" onClick={() => setOpen(false)}>
                  {nav.menuCta}
                </WhatsAppButton>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
