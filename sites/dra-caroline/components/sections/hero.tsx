import { GraduationCap, MapPin } from "lucide-react";
import { hero } from "@/lib/content";
import { ArchPhoto } from "../arch-photo";
import { WhatsAppButton } from "../whatsapp-button";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="bg-paper">
      <div className="container-site pt-8 pb-20 md:pt-14 lg:pt-16 lg:pb-32">
        <div className="hero-fade grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-base font-semibold leading-normal text-sea">{hero.context}</p>
            <h1 id="hero-title" className="t-h1 mt-5 max-w-[12.5em] text-ink">
              {hero.title}
            </h1>
            <p className="t-lead mt-6 max-w-[34em] text-ink lg:mt-8">{hero.lead}</p>

            <WhatsAppButton id="hero-cta" className="mt-8 w-full sm:w-auto lg:mt-10">
              {hero.cta}
            </WhatsAppButton>

            <ul className="t-small mt-8 flex flex-col gap-2.5 text-muted lg:mt-10">
              <li className="flex items-start gap-3">
                <GraduationCap size={18} strokeWidth={1.5} aria-hidden="true" className="mt-[3px] shrink-0 text-sea" />
                <span>{hero.credentials.education}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} strokeWidth={1.5} aria-hidden="true" className="mt-[3px] shrink-0 text-sea" />
                <span>{hero.credentials.location}</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <ArchPhoto
              src={hero.photo.src}
              alt={hero.photo.alt}
              preload
              withArc
              sizes="(min-width: 1024px) 420px, 78vw"
              objectPosition="50% 60%"
              className="w-[78%] max-w-[420px] lg:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
