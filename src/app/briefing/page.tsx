import type { Metadata } from "next";
import { Brand } from "@/components/Brand";
import { parseClientSlug } from "@/lib/schemas";
import { BriefingForm } from "./BriefingForm";

export const metadata: Metadata = {
  title: "Briefing",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BriefingPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = Array.isArray(params.cliente) ? params.cliente[0] : params.cliente;
  const clientSlug = parseClientSlug(raw);

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 sm:px-8">
          <Brand tone="light" />
          {clientSlug && (
            <span className="max-w-[45%] truncate border border-brand px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand">
              {clientSlug}
            </span>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-14">
          <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand">
            Briefing
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Vamos criar a inteligência artificial da sua empresa.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Leva poucos minutos. Quanto mais você nos contar, melhor será o atendimento da sua IA.
          </p>
        </div>
        <div className="h-1.5 bg-brand" />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <BriefingForm clientSlug={clientSlug} />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-8 text-xs text-mute sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} NewWay Marketing World</span>
          <span>Suas informações são usadas apenas para criar o seu atendimento com IA.</span>
        </div>
      </footer>
    </div>
  );
}
