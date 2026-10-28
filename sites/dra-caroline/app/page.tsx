import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Hero } from "@/components/sections/hero";
import { Recognize } from "@/components/sections/recognize";
import { Approach } from "@/components/sections/approach";
import { About } from "@/components/sections/about";
import { Specialties } from "@/components/sections/specialties";
import { Testimonials, getTestimonialImages } from "@/components/sections/testimonials";
import { HowToBook } from "@/components/sections/how-to-book";
import { Faq, answeredFaq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { SiteFooter } from "@/components/sections/site-footer";
import { nav } from "@/lib/content";

export default function Home() {
  const testimonialImages = getTestimonialImages();

  // Seções que podem não existir ainda saem também do menu.
  const links = nav.links.filter((link) => {
    if (link.id === "depoimentos") return testimonialImages.length > 0;
    if (link.id === "duvidas") return answeredFaq.length > 0;
    return true;
  });

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {nav.skipLink}
      </a>
      <SiteHeader links={links} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Recognize />
        <Approach />
        <About />
        <Specialties />
        <Testimonials images={testimonialImages} />
        <HowToBook />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
