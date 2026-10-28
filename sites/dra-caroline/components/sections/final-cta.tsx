import { finalCta } from "@/lib/content";
import { WhatsAppButton } from "../whatsapp-button";

export function FinalCta() {
  return (
    <section id="cta-final" aria-labelledby="cta-final-title" className="on-ink bg-ink text-paper">
      <div className="container-site flex flex-col items-center py-24 text-center lg:py-32">
        <h2 id="cta-final-title" className="t-h2 max-w-[18em]">
          {finalCta.title}
        </h2>
        <p className="t-body mt-6 max-w-[56ch] text-paper">{finalCta.text}</p>
        <WhatsAppButton variant="inverse" className="mt-10 w-full sm:w-auto">
          {finalCta.cta}
        </WhatsAppButton>
      </div>
    </section>
  );
}
