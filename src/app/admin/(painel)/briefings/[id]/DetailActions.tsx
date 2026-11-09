"use client";

import { useState } from "react";
import { MAX_NOTES_LENGTH, STATUSES, type BriefingStatus } from "@/lib/constants";

type Props = {
  id: string;
  initialStatus: BriefingStatus;
  initialNotes: string;
  promptText: string;
};

type Feedback = { kind: "ok" | "error"; text: string } | null;

export function DetailActions({ id, initialStatus, initialNotes, promptText }: Props) {
  const [status, setStatus] = useState<BriefingStatus>(initialStatus);
  const [savedStatus, setSavedStatus] = useState<BriefingStatus>(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [savedNotes, setSavedNotes] = useState(initialNotes);
  const [busy, setBusy] = useState<"status" | "notes" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [copied, setCopied] = useState(false);

  async function patch(body: { status?: BriefingStatus; internal_notes?: string }, kind: "status" | "notes") {
    setBusy(kind);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/briefings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFeedback({
          kind: "error",
          text: res.status === 401 ? "Sessão expirada. Entre novamente." : data.error ?? "Não foi possível salvar.",
        });
        return false;
      }
      setFeedback({ kind: "ok", text: kind === "status" ? "Status atualizado." : "Notas salvas." });
      return true;
    } catch {
      setFeedback({ kind: "error", text: "Sem conexão. Tente novamente." });
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function onStatusChange(next: BriefingStatus) {
    setStatus(next);
    const ok = await patch({ status: next }, "status");
    if (ok) setSavedStatus(next);
    else setStatus(savedStatus);
  }

  async function onSaveNotes() {
    const ok = await patch({ internal_notes: notes }, "notes");
    if (ok) setSavedNotes(notes);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      // Fallback para navegadores sem Clipboard API.
      const ta = document.createElement("textarea");
      ta.value = promptText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const notesDirty = notes !== savedNotes;

  return (
    <div className="space-y-10 lg:sticky lg:top-6">
      {/* Copiar prompt */}
      <section aria-labelledby="ia">
        <h2 id="ia" className="label mb-4">
          Inteligência artificial
        </h2>
        <button type="button" onClick={copyPrompt} className="btn-primary w-full">
          {copied ? "✓ Copiado!" : "Copiar para prompt da IA"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-mute">
          Copia a resposta formatada como instrução de sistema, pronta para colar no Google Gemini.
        </p>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? "Prompt copiado para a área de transferência." : ""}
        </span>
      </section>

      {/* Status */}
      <section aria-labelledby="st">
        <h2 id="st" className="label mb-4">
          Status
        </h2>
        <div role="radiogroup" aria-labelledby="st" className="grid gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={status === s}
              disabled={busy === "status"}
              onClick={() => s !== status && onStatusChange(s)}
              className={`flex items-center justify-between border-2 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 ${
                status === s
                  ? "border-ink bg-brand text-ink"
                  : "border-line bg-paper hover:border-ink"
              }`}
            >
              {s}
              {status === s && <span aria-hidden="true">●</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Notas internas */}
      <section aria-labelledby="notas">
        <h2 id="notas" className="label mb-4">
          Notas internas
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={MAX_NOTES_LENGTH}
          rows={7}
          aria-labelledby="notas"
          placeholder="Observações da equipe (o cliente nunca vê isto)…"
          className="w-full resize-y border-2 border-ink bg-paper p-3 text-sm leading-relaxed placeholder:text-ink/35 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/40"
        />
        <button
          type="button"
          onClick={onSaveNotes}
          disabled={!notesDirty || busy === "notes"}
          className="btn-ghost mt-3 w-full"
        >
          {busy === "notes" ? "Salvando…" : "Salvar notas"}
        </button>
      </section>

      {feedback && (
        <p
          role={feedback.kind === "error" ? "alert" : "status"}
          className={`border-l-4 px-4 py-3 text-sm font-medium ${
            feedback.kind === "ok"
              ? "border-brand bg-brand-soft"
              : "border-red-600 bg-red-50 text-red-800"
          }`}
        >
          {feedback.text}
        </p>
      )}

      {/* Exportar */}
      <section aria-labelledby="exp">
        <h2 id="exp" className="label mb-4">
          Exportar
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <a href={`/api/admin/briefings/${id}/export?format=txt`} download className="btn-ghost">
            .txt
          </a>
          <a href={`/api/admin/briefings/${id}/export?format=md`} download className="btn-ghost">
            .md
          </a>
        </div>
      </section>
    </div>
  );
}
