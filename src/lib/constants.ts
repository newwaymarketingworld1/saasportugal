export const STATUSES = ["novo", "em análise", "concluído"] as const;
export type BriefingStatus = (typeof STATUSES)[number];

export const MIN_ANSWER_LENGTH = 300;
export const MAX_ANSWER_LENGTH = 20000;
export const MAX_NOTES_LENGTH = 10000;

export const QUALITY_GOOD_AT = 700;
export const QUALITY_EXCELLENT_AT = 1500;

export const MAIN_QUESTION =
  "Descreva com o máximo de detalhes possível a sua empresa, os seus serviços e os seus produtos — para que possamos criar uma inteligência artificial que atenda os seus clientes com real utilidade.";

export const IMPORTANT_NOTICE =
  "Importante: a inteligência da sua IA depende diretamente da sua resposta. Quanto mais completa e detalhada for a descrição, mais precisa, útil e humana será a IA no atendimento dos seus clientes. Respostas curtas geram uma IA limitada.";

export const SUGGESTIONS = [
  "História e diferenciais da empresa",
  "Lista de serviços e produtos, com preços ou faixas de preço",
  "Horários e formas de atendimento",
  "Endereço e área de atuação",
  "Formas de pagamento",
  "Perguntas que os clientes mais fazem e as respostas ideais",
  "O que a IA NÃO deve dizer ou prometer",
  "Tom de voz desejado",
];

/** Tipo de uma linha da tabela briefings. */
export type Briefing = {
  id: string;
  created_at: string;
  client_slug: string | null;
  responsible_name: string;
  company_name: string;
  whatsapp: string;
  email: string;
  website: string | null;
  main_answer: string;
  status: BriefingStatus;
  internal_notes: string;
  answer_length: number;
};
