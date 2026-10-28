import { specialties } from "@/lib/content";
import { SpecialtiesTabs } from "../specialties-tabs";
import { ConditionList } from "../condition-list";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { WhatsAppButton } from "../whatsapp-button";

export function Specialties() {
  return (
    <section id="especialidades" aria-labelledby="especialidades-title" className="section-y bg-paper">
      <div className="container-site">
        <h2 id="especialidades-title" className="t-h2 text-ink">
          {specialties.title}
        </h2>
        <p className="t-lead mt-6 text-ink lg:mt-8">{specialties.lead}</p>

        {/* Desktop (≥1024px): índice + painel */}
        <div className="mt-14 hidden lg:mt-16 lg:block">
          <SpecialtiesTabs />
        </div>

        {/* Mobile e tablet (<1024px): accordion, um aberto por vez */}
        <div className="mt-10 lg:hidden">
          <Accordion defaultValue={[specialties.areas[0].id]} collapsible={false}>
            {specialties.areas.map((area) => (
              <AccordionItem key={area.id} value={area.id}>
                <AccordionTrigger className="text-[1.1875rem] leading-[1.4]">{area.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="t-body text-muted">{area.description}</p>
                  <div className="mt-6">
                    <ConditionList area={area} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-14 flex flex-col gap-5 lg:mt-20">
          <p className="t-h3 text-ink">{specialties.notFound}</p>
          <WhatsAppButton className="w-full self-start sm:w-auto">{specialties.cta}</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
