"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  IMPORTANT_NOTICE,
  MAIN_QUESTION,
  MAX_ANSWER_LENGTH,
  MIN_ANSWER_LENGTH,
  SUGGESTIONS,
} from "@/lib/constants";
import { getQuality } from "@/lib/quality";
import { briefingSchema, fieldErrors } from "@/lib/schemas";

type Fields = {
  company_name: string;
  main_answer: string;
};

const EMPTY: Fields = {
  company_name: "",
  main_answer: "",
};

type Errors = Partial<Record<keyof Fields | "_form", string>>;

const QUALITY_BAR: Record<number, string> = {
  0: "bg-ink/20",
  1: "bg-brand/60",
  2: "bg-brand",
  3: "bg-ink",
};

export function BriefingForm({ clientSlug }: { clientSlug: string | null }) {
  const draftKey = `newway-briefing-draft:${clientSlug ?? "geral"}`;
  const uid = useId();

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [restored, setRestored] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const errorSummary = useRef<HTMLDivElement>(null);

  // Restaura o rascunho salvo (se existir).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Fields>;
        const merged = { ...EMPTY };
        (Object.keys(EMPTY) as (keyof Fields)[]).forEach((k) => {
          if (typeof saved[k] === "string") merged[k] = saved[k] as string;
        });
        if (Object.values(merged).some((v) => v.trim() !== "")) {
          setFields(merged);
          setRestored(true);
        }
      }
    } catch {
      // localStorage indisponível: segue sem rascunho.
    }
    setDraftReady(true);
  }, [draftKey]);

  // Salva automaticamente (com pequeno atraso) a cada alteração.
  useEffect(() => {
    if (!draftReady || done) return;
    const timer = setTimeout(() => {
      try {
        if (Object.values(fields).every((v) => v === "")) {
          localStorage.removeItem(draftKey);
          return;
        }
        localStorage.setItem(draftKey, JSON.stringify(fields));
        setSavedAt(new Date());
      } catch {
        // cota cheia ou bloqueado: ignora.
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [fields, draftKey, draftReady, done]);

  const setField = useCallback((name: keyof Fields, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const length = fields.main_answer.trim().length;
  const quality = useMemo(() => getQuality(length), [length]);
  const missing = Math.max(0, MIN_ANSWER_LENGTH - length);
  const canSubmit = missing === 0 && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = briefingSchema.safeParse({ ...fields, client_slug: clientSlug });
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error) as Errors;
      setErrors(fe);
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, client_slug: clientSlug, hp_contact: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        fields?: Errors;
      };
      if (!res.ok) {
        setErrors({ ...(data.fields ?? {}), _form: data.error ?? "Não foi possível enviar." });
        requestAnimationFrame(() => errorSummary.current?.focus());
        return;
      }
      try {
        localStorage.removeItem(draftKey);
      } catch {}
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ _form: "Sem conexão. Seu texto continua salvo — tente novamente." });
      requestAnimationFrame(() => errorSummary.current?.focus());
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <ThankYou />;

  const hasErrors = Object.values(errors).some(Boolean);

  const idFor = (n: string) => `${uid}-${n}`;
  const fieldProps = (name: keyof Fields) => ({
    id: idFor(name),
    name,
    value: fields[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${idFor(name)}-err` : undefined,
    className: `field ${errors[name] ? "field-error" : ""}`,
  });
  const err = (name: keyof Fields) =>
    errors[name] ? (
      <p id={`${idFor(name)}-err`} role="alert" className="mt-2 text-sm font-medium text-red-700">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-16">
      {restored && (
        <p className="border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm">
          Recuperamos o rascunho que você havia começado.{" "}
          <button
            type="button"
            className="font-bold underline underline-offset-4"
            onClick={() => {
              setFields(EMPTY);
              setRestored(false);
              try {
                localStorage.removeItem(draftKey);
              } catch {}
            }}
          >
            Começar do zero
          </button>
        </p>
      )}

      {(hasErrors || errors._form) && (
        <div
          ref={errorSummary}
          tabIndex={-1}
          role="alert"
          className="border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {errors._form ?? "Revise os campos destacados antes de enviar."}
        </div>
      )}

      {/* ----------------------------- Identificação ----------------------------- */}
      <section aria-labelledby={idFor("s1")}>
        <SectionTitle id={idFor("s1")} n="01" title="Sobre você" />
        <div>
          <label htmlFor={idFor("company_name")} className="label">
            Nome da empresa
          </label>
          <input
            {...fieldProps("company_name")}
            type="text"
            autoComplete="organization"
            maxLength={160}
            required
            placeholder="Razão social ou nome fantasia"
            onChange={(e) => setField("company_name", e.target.value)}
          />
          {err("company_name")}
        </div>
      </section>

      {/* ------------------------------ Pergunta principal ------------------------------ */}
      <section aria-labelledby={idFor("s2")}>
        <SectionTitle id={idFor("s2")} n="02" title="Sua empresa" />

        <div className="mb-8 border-2 border-brand bg-paper p-5 sm:p-6" role="note">
          <p className="text-sm font-medium leading-relaxed sm:text-base">
            <strong className="font-extrabold">Importante:</strong>{" "}
            {IMPORTANT_NOTICE.replace(/^Importante:\s*/, "")}
          </p>
        </div>

        <label htmlFor={idFor("main_answer")} className="mb-4 block text-lg font-bold leading-snug sm:text-xl">
          {MAIN_QUESTION}
        </label>

        <textarea
          {...fieldProps("main_answer")}
          className={`w-full resize-y border-2 bg-paper p-4 text-base leading-relaxed text-ink transition-colors placeholder:text-ink/35 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/40 ${
            errors.main_answer ? "border-red-600" : "border-ink"
          }`}
          rows={14}
          maxLength={MAX_ANSWER_LENGTH}
          required
          placeholder="Escreva aqui, com suas palavras, tudo o que um atendente precisaria saber sobre a sua empresa…"
          onChange={(e) => setField("main_answer", e.target.value)}
          aria-describedby={`${idFor("counter")}${errors.main_answer ? ` ${idFor("main_answer")}-err` : ""}`}
          style={{ minHeight: "20rem" }}
        />
        {err("main_answer")}

        {/* Contador + indicador de qualidade */}
        <div id={idFor("counter")} className="mt-4" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold tabular-nums">
              {length.toLocaleString("pt-BR")} caracteres
              {missing > 0 && (
                <span className="font-normal text-mute">
                  {" "}
                  · faltam {missing.toLocaleString("pt-BR")} para o mínimo
                </span>
              )}
            </span>
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em]">
              Qualidade: {quality.label}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 transition-colors ${
                  quality.level >= step ? QUALITY_BAR[quality.level] : "bg-ink/10"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-mute">{quality.hint}</p>
        </div>

        {/* Sugestões (guia, não são campos) */}
        <div className="mt-10 bg-ink p-6 text-white sm:p-8">
          <p className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brand">
            O que vale a pena incluir
          </p>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <li key={s} className="flex gap-3 text-sm leading-snug text-white/85">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 bg-brand" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Honeypot — invisível para pessoas, tentador para robôs */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={idFor("hp")}>Não preencha este campo</label>
        <input
          id={idFor("hp")}
          type="text"
          name="hp_contact"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-mute" aria-live="polite">
          {savedAt
            ? `Rascunho salvo automaticamente às ${savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`
            : "Seu texto é salvo automaticamente neste dispositivo."}
        </p>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={!canSubmit}>
          {submitting ? "Enviando…" : "Enviar briefing"}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({ id, n, title }: { id: string; n: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="text-sm font-extrabold text-brand [-webkit-text-stroke:1px_#0a0a0a]">
        {n}
      </span>
      <h2 id={id} className="text-2xl font-extrabold sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ThankYou() {
  return (
    <div className="py-10 text-center sm:py-20" role="status">
      <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center bg-brand">
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold sm:text-4xl">Obrigado!</h2>
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink/75 sm:text-lg">
        Recebemos o seu briefing. Nossa equipe vai analisar cada detalhe e entrará em contato em
        breve para dar vida à inteligência artificial da sua empresa.
      </p>
      <div className="mx-auto mt-10 h-1 w-16 bg-brand" />
    </div>
  );
}
