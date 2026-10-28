import fs from "node:fs";
import path from "node:path";
import { testimonials } from "@/lib/content";
import { TestimonialsCarousel, type TestimonialImage } from "../testimonials-carousel";
import { WhatsAppButton } from "../whatsapp-button";

/** Prints presentes em /public/depoimentos (verificado no build). */
export function getTestimonialImages(): TestimonialImage[] {
  const dir = path.join(process.cwd(), "public", "depoimentos");
  return testimonials.files
    .filter((file) => fs.existsSync(path.join(dir, file)))
    .map((file) => ({ src: `/depoimentos/${file}` }));
}

export function Testimonials({ images }: { images: TestimonialImage[] }) {
  if (images.length === 0) return null;

  return (
    <section id="depoimentos" aria-labelledby="depoimentos-title" className="section-y bg-mist">
      <div className="container-site">
        <TestimonialsCarousel images={images} titleId="depoimentos-title" />
        <WhatsAppButton className="mt-12 w-full sm:w-auto">{testimonials.cta}</WhatsAppButton>
      </div>
    </section>
  );
}
