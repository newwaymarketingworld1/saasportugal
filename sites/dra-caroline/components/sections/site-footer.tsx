import { contact } from "@/lib/content";
import { WHATSAPP_URL } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="on-ink bg-ink text-paper">
      <div className="border-t border-paper/15">
        <div className="container-site pt-16 pb-[calc(40px+env(safe-area-inset-bottom))] md:pt-20">
          <p className="font-serif text-[1.75rem] leading-tight">{contact.name}</p>
          <p className="mt-1 text-[1.0625rem] text-paper/80">{contact.role}</p>

          <dl className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            <div>
              <dt className="text-[0.9375rem] font-semibold text-paper/70">{contact.whatsappLabel}</dt>
              <dd className="mt-2 text-[1.0625rem] leading-relaxed">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-whatsapp=""
                  className="link-text inline-flex min-h-12 items-start"
                >
                  {contact.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.9375rem] font-semibold text-paper/70">{contact.instagramLabel}</dt>
              <dd className="mt-2 text-[1.0625rem] leading-relaxed">
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-text inline-flex min-h-12 items-start"
                >
                  {contact.instagramHandle}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.9375rem] font-semibold text-paper/70">{contact.addressLabel}</dt>
              <dd className="mt-2 text-[1.0625rem] leading-relaxed">
                <address className="not-italic">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-text mt-1 inline-flex min-h-12 items-center"
                >
                  {contact.mapLabel}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-14 border-t border-paper/15 pt-8">
            <p className="t-small text-paper/80">
              {contact.responsible.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="t-small text-paper/80">{contact.copyright(year)}</p>
              <a href="#inicio" className="t-small link-text inline-flex min-h-12 items-center self-start sm:self-auto">
                {contact.backToTop}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
