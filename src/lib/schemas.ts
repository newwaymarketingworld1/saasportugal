import { z } from "zod";
import {
  MAX_ANSWER_LENGTH,
  MAX_NOTES_LENGTH,
  MIN_ANSWER_LENGTH,
  STATUSES,
} from "./constants";
import { sanitizeLine, sanitizeText } from "./sanitize";

const line = (min: number, max: number, requiredMsg: string) =>
  z
    .string({ error: requiredMsg })
    .transform(sanitizeLine)
    .pipe(
      z
        .string()
        .min(min, requiredMsg)
        .max(max, `Use no máximo ${max} caracteres.`),
    );

/** Normaliza o campo "Site ou Instagram" (opcional). */
function normalizeWebsite(raw: string): string | null {
  const value = sanitizeLine(raw);
  if (!value) return "";

  // @usuario do Instagram
  if (/^@[A-Za-z0-9._]{1,30}$/.test(value)) return value;

  // URL com protocolo (apenas http/https — nunca javascript:, data:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    if (!/^https?:\/\//i.test(value)) return null;
    try {
      const url = new URL(value);
      if (!url.hostname.includes(".")) return null;
      return url.toString().slice(0, 200);
    } catch {
      return null;
    }
  }

  // domínio sem protocolo (ex.: minhaempresa.com.br ou instagram.com/empresa)
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(value)) {
    try {
      return new URL(`https://${value}`).toString().slice(0, 200);
    } catch {
      return null;
    }
  }
  return null;
}

export const clientSlugSchema = z
  .string()
  .transform((v) => v.trim().toLowerCase())
  .pipe(z.string().regex(/^[a-z0-9][a-z0-9_-]{0,59}$/));

/** Extrai um slug válido de um valor qualquer (ex.: ?cliente=...). */
export function parseClientSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const parsed = clientSlugSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export const briefingSchema = z.object({
  responsible_name: line(2, 120, "Informe o nome do responsável."),
  company_name: line(2, 160, "Informe o nome da empresa."),
  whatsapp: z
    .string({ error: "Informe o WhatsApp." })
    .transform((v) => v.replace(/[^\d+()\-\s]/g, "").trim())
    .refine(
      (v) => {
        const digits = v.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 13;
      },
      "Informe um WhatsApp válido, com DDD.",
    ),
  email: z
    .string({ error: "Informe o e-mail." })
    .trim()
    .toLowerCase()
    .max(254, "E-mail muito longo.")
    .pipe(z.email("Informe um e-mail válido.")),
  website: z
    .string()
    .optional()
    .default("")
    .transform((v, ctx) => {
      const normalized = normalizeWebsite(v);
      if (normalized === null) {
        ctx.addIssue({
          code: "custom",
          message: "Use um endereço de site (https://...) ou @usuario do Instagram.",
        });
        return z.NEVER;
      }
      return normalized;
    }),
  main_answer: z
    .string({ error: "Descreva a sua empresa." })
    .transform((v) => sanitizeText(v).trim())
    .pipe(
      z
        .string()
        .min(
          MIN_ANSWER_LENGTH,
          `Escreva pelo menos ${MIN_ANSWER_LENGTH} caracteres para que a IA tenha conteúdo suficiente.`,
        )
        .max(MAX_ANSWER_LENGTH, `Use no máximo ${MAX_ANSWER_LENGTH} caracteres.`),
    ),
  client_slug: z
    .string()
    .nullish()
    .transform((v) => parseClientSlug(v ?? null)),
});

export type BriefingInput = z.infer<typeof briefingSchema>;

export const briefingUpdateSchema = z
  .object({
    status: z.enum(STATUSES).optional(),
    internal_notes: z
      .string()
      .max(MAX_NOTES_LENGTH, `Use no máximo ${MAX_NOTES_LENGTH} caracteres.`)
      .transform((v) => sanitizeText(v))
      .optional(),
  })
  .refine((v) => v.status !== undefined || v.internal_notes !== undefined, {
    message: "Nada para atualizar.",
  });

export const uuidSchema = z.string().uuid();

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido.")),
  password: z.string().min(1, "Informe a senha.").max(200),
});

/** Converte issues do Zod em { campo: mensagem }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
