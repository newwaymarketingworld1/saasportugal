import { about } from "@/lib/content";
import { ArchPhoto } from "../arch-photo";
import { WhatsAppButton } from "../whatsapp-button";

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="section-y bg-mist">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="flex justify-center lg:col-span-5 lg:justify-start">
            <ArchPhoto
              src={about.photo.src}
              alt={about.photo.alt}
              sizes="(min-width: 1024px) 440px, 78vw"
              objectPosition="50% 35%"
              className="w-[78%] max-w-[440px] lg:w-full"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="sobre-title" className="t-h2 text-ink">
              {about.title}
            </h2>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="t-body mt-6 text-ink first-of-type:mt-8">
                {p}
              </p>
            ))}
            <blockquote className="mt-10 max-w-[30em] border-l-2 border-sea pl-6">
              <p className="font-serif text-[1.625rem] leading-[1.35] text-ink">{about.quote}</p>
            </blockquote>
          </div>
        </div>

        {/* Formação: linha do tempo vertical no mobile, horizontal no desktop */}
        <div className="mt-16 lg:mt-24">
          <h3 className="t-h3 text-ink">{about.timelineLabel}</h3>
          <ol className="mt-8 grid grid-cols-1 gap-y-8 lg:mt-10 lg:grid-cols-4 lg:gap-x-8">
            {about.timeline.map((step, i) => (
              <li key={step.title} className="relative pl-8 lg:pt-9 lg:pl-0">
                {/* Conector até o próximo marco */}
                {i < about.timeline.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[13px] -bottom-[45px] left-[4.5px] w-px bg-line lg:top-[4.5px] lg:-right-8 lg:bottom-auto lg:left-[10px] lg:h-px lg:w-auto"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute top-[8px] left-0 size-[10px] rounded-full bg-sun lg:top-0"
                />
                <p className="font-semibold leading-[1.45] text-ink">{step.title}</p>
                <p className="t-small mt-1.5 max-w-[24em] text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>

        <WhatsAppButton className="mt-12 w-full sm:w-auto lg:mt-16">{about.cta}</WhatsAppButton>
      </div>
    </section>
  );
}
