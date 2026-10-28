import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Hero } from "@/components/sections/hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { nav } from "@/lib/content";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {nav.skipLink}
      </a>
      <SiteHeader links={nav.links} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
