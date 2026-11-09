import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { Briefing } from "@/lib/constants";
import { buildGeminiPrompt, formatDate, websiteHref, whatsappHref } from "@/lib/format";
import { getQuality } from "@/lib/quality";
import { uuidSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { DetailActions } from "./DetailActions";

export const metadata: Metadata = { title: "Briefing" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BriefingDetail({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("briefings").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const b = data as Briefing;

  const quality = getQuality(b.answer_length);
  const wa = whatsappHref(b.whatsapp);
  const site = websiteHref(b.website);

  // Todo texto abaixo é renderizado como nó de texto do React (escapado
  // automaticamente). Nunca usamos dangerouslySetInnerHTML.
  return (
    <>
      <Link
        href="/admin"
        className="mb-8 inline-block text-xs font-bold uppercase tracking-[0.16em] underline-offset-4 hover:underline"
      >
        ← Voltar para a lista
      </Link>

      <div className="mb-10 border-b-4 border-brand pb-8">
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-mute">Briefing</p>
        <h1 className="break-words text-3xl font-extrabold sm:text-5xl">{b.company_name}</h1>
        <p className="mt-3 text-sm text-mute">
          Recebido em {formatDate(b.created_at)} · {b.answer_length.toLocaleString("pt-BR")} caracteres ·
          Qualidade {quality.label}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Coluna principal */}
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="contato">
            <h2 id="contato" className="label mb-5">
              Contato
            </h2>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Info label="Empresa" value={b.company_name} />
              {b.responsible_name && <Info label="Responsável" value={b.responsible_name} />}
              {b.whatsapp && <Info label="WhatsApp" value={b.whatsapp} href={wa} external />}
              {b.email && <Info label="E-mail" value={b.email} href={`mailto:${b.email}`} />}
              {b.website && <Info label="Site / Instagram" value={b.website} href={site} external />}
              {b.client_slug && <Info label="Identificador do cliente" value={b.client_slug} />}
            </dl>
          </section>

          <section aria-labelledby="resposta">
            <h2 id="resposta" className="label mb-5">
              Resposta do cliente
            </h2>
            <div className="whitespace-pre-wrap break-words border-l-4 border-ink bg-neutral-50 p-5 text-[0.95rem] leading-relaxed sm:p-8">
              {b.main_answer}
            </div>
          </section>
        </div>

        {/* Coluna lateral: ações */}
        <aside className="min-w-0">
          <DetailActions
            id={b.id}
            initialStatus={b.status}
            initialNotes={b.internal_notes}
            promptText={buildGeminiPrompt(b)}
          />
        </aside>
      </div>
    </>
  );
}

function Info({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string | null;
  external?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-mute">{label}</dt>
      <dd className="mt-1 break-words font-semibold">
        {href ? (
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="underline decoration-brand decoration-2 underline-offset-4 hover:bg-brand"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
