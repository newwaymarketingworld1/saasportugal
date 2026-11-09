/**
 * Higieniza texto vindo de formulários antes de salvar.
 *
 * - remove caracteres de controle (exceto quebra de linha e tabulação);
 * - remove marcações HTML (<tag>) e o tag <script>/<style> inteiro;
 * - normaliza quebras de linha.
 *
 * A exibição no painel continua segura de qualquer forma, pois o React escapa
 * todo texto renderizado (nunca usamos dangerouslySetInnerHTML).
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<(script|style)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/?[a-z!][^>]*>/gi, "")
    .replace(/‮|​|﻿/g, "");
}

export function sanitizeLine(input: string): string {
  return sanitizeText(input).replace(/\s+/g, " ").trim();
}

/** Remove caracteres que têm significado especial em filtros do PostgREST. */
export function sanitizeSearchTerm(input: string): string {
  return input
    .replace(/[,()%*\\:"'`;]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** Nome de arquivo seguro (sem acentos, espaços ou caracteres especiais). */
export function toFileSlug(input: string): string {
  const slug = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return slug || "briefing";
}
