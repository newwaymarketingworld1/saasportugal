import { howToBook } from "@/lib/content";
import { WhatsAppButton } from "../whatsapp-button";

export function HowToBook() {
  return (
    <section id="agendar" aria-labelledby="agendar-title" className="section-y bg-paper">
      <div className="container-site">
        <h2 id="agendar-title" className="t-h2 text-ink">
          {howToBook.title}
        </h2>

        <ol className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:mt-16">
          {howToBook.steps.map((step, i) => (
            <li key={step.title} className="relative grid grid-cols-[48px_1fr] gap-x-5 md:block">
              {/* Mobile: linha vertical ligando os números */}
              {i < howToBook.steps.length - 1 && (
                <span aria-hidden="true" className="absolute top-[64px] -bottom-6 left-[24px] w-px bg-line md:hidden" />
              )}
              <span aria-hidden="true" className="font-serif text-[3rem] leading-none text-center text-sea md:block md:text-left">
                {i + 1}
              </span>
              <div className="pt-1.5 md:mt-6 md:pt-0">
                <h3 className="t-h3 text-ink">
                  <span className="sr-only">{`Passo ${i + 1}: `}</span>
                  {step.title}
                </h3>
                <p className="t-body mt-2 max-w-[22em] text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <WhatsAppButton className="mt-12 w-full sm:w-auto lg:mt-16">{howToBook.cta}</WhatsAppButton>
      </div>
    </section>
  );
}
