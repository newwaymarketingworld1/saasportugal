import { faq } from "@/lib/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

/** Só perguntas com resposta confirmada pela cliente. */
export const answeredFaq = faq.items.filter(
  (item): item is { question: string; answer: string } => item.answer !== null,
);

export function Faq() {
  if (answeredFaq.length === 0) return null;

  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="section-y bg-mist">
      <div className="container-site grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <h2 id="duvidas-title" className="t-h2 text-ink lg:col-span-4">
          {faq.title}
        </h2>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion multiple>
            {answeredFaq.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`}>
                <AccordionTrigger className="py-5 text-[1.1875rem] leading-[1.4]">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="t-body text-muted">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
