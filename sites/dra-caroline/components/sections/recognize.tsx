import { Check } from "lucide-react";
import { recognize } from "@/lib/content";
import { WhatsAppButton } from "../whatsapp-button";

export function Recognize() {
  return (
    <section id="reumatologia" aria-labelledby="reumatologia-title" className="section-y bg-mist">
      <div className="container-site grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <h2 id="reumatologia-title" className="t-h2 text-ink">
            {recognize.title}
          </h2>
          <p className="t-body mt-6 text-muted lg:mt-8">{recognize.text}</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ul>
            {recognize.signs.map((sign, i) => (
              <li
                key={sign}
                className={`flex items-start gap-4 py-5 text-[1.1875rem] leading-[1.55] text-ink ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <Check size={20} strokeWidth={1.5} aria-hidden="true" className="mt-1 shrink-0 text-sea" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <WhatsAppButton className="mt-8 w-full sm:w-auto lg:mt-10">{recognize.cta}</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
