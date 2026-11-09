import type { Briefing } from "./constants";

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

/** Apenas links http(s) são clicáveis; qualquer outra coisa vira texto puro. */
export function safeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : null;
}

export function websiteHref(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("@")) return `https://instagram.com/${value.slice(1)}`;
  return safeHref(value);
}

export function whatsappHref(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.length <= 11) digits = `55${digits}`;
  return `https://wa.me/${digits}`;
}

/**
 * Texto pronto para colar como instrução de sistema (system instruction) do
 * Google Gemini.
 */
export function buildGeminiPrompt(b: Briefing): string {
  const lines = [
    `# INSTRUÇÕES DE SISTEMA — ASSISTENTE VIRTUAL DA ${b.company_name.toUpperCase()}`,
    "",
    `Você é o assistente virtual de atendimento da empresa "${b.company_name}". Atenda os clientes pelo site com simpatia, clareza e objetividade, sempre em português do Brasil.`,
    "",
    "## Regras de atendimento",
    "- Responda SOMENTE com base nas informações da seção \"Informações da empresa\" abaixo.",
    "- Se não souber a resposta, ou se a informação não estiver abaixo, diga com honestidade que vai encaminhar o cliente para a equipe e peça nome e WhatsApp para contato. Nunca invente preços, prazos, horários, condições ou promessas.",
    "- Respeite rigorosamente o que a empresa pediu para a IA NÃO dizer ou prometer.",
    "- Respeite o tom de voz indicado pela empresa. Se não houver indicação, seja cordial, profissional e natural.",
    "- Faça respostas curtas e úteis; faça uma pergunta por vez quando precisar entender a necessidade do cliente.",
    "- Sempre que fizer sentido, conduza o cliente para o próximo passo (orçamento, agendamento, compra ou contato).",
    "",
    "## Dados da empresa",
    `- Empresa: ${b.company_name}`,
  ];
  if (b.responsible_name) lines.push(`- Responsável: ${b.responsible_name}`);
  if (b.whatsapp) lines.push(`- WhatsApp: ${b.whatsapp}`);
  if (b.email) lines.push(`- E-mail: ${b.email}`);
  if (b.website) lines.push(`- Site/Instagram: ${b.website}`);
  lines.push(
    "",
    "## Informações da empresa (fornecidas pelo responsável)",
    "",
    b.main_answer.trim(),
    "",
  );
  return lines.join("\n");
}

/** Briefing completo em Markdown (para exportação). */
export function buildMarkdown(b: Briefing): string {
  const lines = [
    `# Briefing — ${b.company_name}`,
    "",
  ];
  if (b.responsible_name) lines.push(`- **Responsável:** ${b.responsible_name}`);
  if (b.whatsapp) lines.push(`- **WhatsApp:** ${b.whatsapp}`);
  if (b.email) lines.push(`- **E-mail:** ${b.email}`);
  if (b.website) lines.push(`- **Site/Instagram:** ${b.website}`);
  if (b.client_slug) lines.push(`- **Identificador do cliente:** ${b.client_slug}`);
  lines.push(
    `- **Recebido em:** ${formatDate(b.created_at)}`,
    `- **Status:** ${b.status}`,
    `- **Tamanho da resposta:** ${b.answer_length} caracteres`,
    "",
    "## Resposta do cliente",
    "",
    b.main_answer.trim(),
    "",
  );
  if (b.internal_notes.trim()) {
    lines.push("## Notas internas", "", b.internal_notes.trim(), "");
  }
  return lines.join("\n");
}

/** Briefing completo em texto puro (para exportação). */
export function buildPlainText(b: Briefing): string {
  const lines = [
    `BRIEFING — ${b.company_name}`,
    "=".repeat(60),
  ];
  if (b.responsible_name) lines.push(`Responsável: ${b.responsible_name}`);
  if (b.whatsapp) lines.push(`WhatsApp: ${b.whatsapp}`);
  if (b.email) lines.push(`E-mail: ${b.email}`);
  if (b.website) lines.push(`Site/Instagram: ${b.website}`);
  if (b.client_slug) lines.push(`Identificador do cliente: ${b.client_slug}`);
  lines.push(
    `Recebido em: ${formatDate(b.created_at)}`,
    `Status: ${b.status}`,
    `Tamanho da resposta: ${b.answer_length} caracteres`,
    "",
    "RESPOSTA DO CLIENTE",
    "-".repeat(60),
    b.main_answer.trim(),
    "",
  );
  if (b.internal_notes.trim()) {
    lines.push("NOTAS INTERNAS", "-".repeat(60), b.internal_notes.trim(), "");
  }
  return lines.join("\n");
}
