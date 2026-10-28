// Toda a copy do site fica aqui. Texto literal da especificação
// (prompt-site-dra-caroline.md, seção 6). Não alterar sem a cliente.
// \u00a0 = espaço não separável: "Dra." nunca fica sozinha no fim da linha.

export const CTA_LABEL = "Agendar consulta pelo WhatsApp";

export const site = {
  name: "Dra. Caroline Vargas da Cruz",
  shortName: "Dra. Caroline Vargas",
  role: "Reumatologista",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dra.carolinereumato.com.br",
  title: "Dra. Caroline Vargas da Cruz | Reumatologista em Balneário Camboriú",
  description:
    "Reumatologista em Balneário Camboriú com atendimento humanizado e integrativo para dores crônicas, doenças autoimunes, artrite, fibromialgia e osteoporose. Agende sua consulta pelo WhatsApp.",
  ogImageAlt: "Dra. Caroline Vargas da Cruz, reumatologista em Balneário Camboriú",
};

export const nav = {
  brand: "Dra. Caroline Vargas",
  brandRole: "Reumatologista",
  headerCta: "Agendar consulta",
  menuCta: CTA_LABEL,
  menuLabel: "Abrir menu",
  closeLabel: "Fechar menu",
  links: [
    { id: "sobre", label: "Sobre" },
    { id: "especialidades", label: "Especialidades" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "duvidas", label: "Dúvidas" },
    { id: "contato", label: "Contato" },
  ],
  skipLink: "Ir para o conteúdo",
};

export const hero = {
  context: "Reumatologista em Balneário Camboriú",
  title: "Dor que não passa tem causa. E merece ser investigada com calma.",
  lead: "Sou a Dra.\u00a0Caroline Vargas da Cruz. Cuido de pessoas que convivem com dores nas articulações, doenças autoimunes e cansaço sem explicação, com tempo para ouvir a sua história e um plano de cuidado feito para você.",
  cta: CTA_LABEL,
  credentials: {
    education: "Especialista em Reumatologia pela Santa Casa de São Paulo",
    location: "Consultório no bairro Nações, em Balneário Camboriú",
  },
  photo: {
    src: "/images/caroline-hero.jpg",
    alt: "Dra. Caroline Vargas da Cruz, reumatologista em Balneário Camboriú",
  },
};

export const recognize = {
  title: "Talvez seja hora de procurar uma reumatologista se você...",
  text: "A reumatologia vai além das articulações. Ela olha para o corpo inteiro: como ele reage à dor, à rigidez, ao cansaço e até ao estresse. O objetivo é descobrir o que está causando seus sintomas e orientar o cuidado certo.",
  signs: [
    "sente dores constantes nas articulações, nas costas ou nos músculos;",
    "acorda com o corpo rígido, inchado ou sem energia;",
    "já tem diagnóstico de lúpus, artrite reumatoide, esclerodermia ou outra doença autoimune;",
    "fez exames, ouviu que está tudo normal, mas a dor continua;",
    "ou simplesmente quer entender por que sente dor e como o seu corpo funciona.",
  ],
  cta: CTA_LABEL,
};

export const approach = {
  title: "Mais do que aliviar sintomas, entender de onde vem a dor.",
  lead: "A dor tem uma dimensão física, emocional e espiritual. Por isso, o cuidado começa pela escuta: o seu tempo, a sua história e a sua rotina fazem parte do diagnóstico.",
  items: [
    {
      title: "Escuta sem pressa",
      text: "Espaço para contar a sua história com calma, sendo ouvida de verdade.",
    },
    {
      title: "Corpo, mente e espírito",
      text: "Uma abordagem integrativa, que considera emoções, estresse e espiritualidade junto com exames e tratamento.",
    },
    {
      title: "Um plano feito para você",
      text: "Cuidado personalizado, construído com você e ajustado ao longo do tempo.",
    },
    {
      title: "Acompanhamento próximo",
      text: "Doenças reumatológicas pedem acompanhamento contínuo, e não consultas soltas.",
    },
  ],
};

export const about = {
  title: "Prazer, sou a Dra.\u00a0Caroline Vargas da Cruz.",
  paragraphs: [
    "Me encantei pela Reumatologia ainda no terceiro ano da faculdade, pela profundidade da escuta, pela complexidade dos diagnósticos e, principalmente, pela necessidade de enxergar o paciente de forma integral: corpo, mente e alma em movimento.",
    "Hoje atendo em consultório particular, unindo Medicina e Espiritualidade em um modelo de cuidado que valoriza o autoconhecimento, o equilíbrio emocional e a participação de cada paciente no próprio tratamento.",
  ],
  quote:
    "Minha missão é ajudar pessoas com dores crônicas a reencontrarem vitalidade, propósito e paz, através de um olhar humano, integrativo e consciente.",
  timelineLabel: "Formação",
  timeline: [
    {
      title: "Medicina",
      detail: "Universidade do Planalto Catarinense (UNIPLAC), Lages/SC, 2016",
    },
    {
      title: "Residência em Clínica Médica",
      detail: "Hospital Nossa Senhora da Conceição, Tubarão/SC",
    },
    {
      title: "Especialização em Reumatologia",
      detail: "Irmandade da Santa Casa de Misericórdia de São Paulo",
    },
    {
      title: "Hoje",
      detail: "Consultório particular em Balneário Camboriú/SC",
    },
  ],
  photo: {
    src: "/images/caroline-sobre.jpg",
    alt: "Retrato da Dra. Caroline Vargas da Cruz, reumatologista",
  },
  cta: CTA_LABEL,
};

export const specialties = {
  title: "O que eu trato",
  lead: "Seis áreas de atuação, com as principais condições de cada uma. Se a sua não estiver aqui, me envie uma mensagem.",
  conditionsLabel: "Condições tratadas:",
  areas: [
    {
      id: "autoimunes",
      title: "Doenças autoimunes",
      description:
        "Quando o corpo, por engano, passa a atacar a si mesmo, causando dor, cansaço e inflamação.",
      conditions: [
        "Lúpus Eritematoso Sistêmico (LES)",
        "Artrite Reumatoide (AR)",
        "Esclerodermia / Esclerose Sistêmica",
        "Síndrome de Sjögren",
        "Dermatomiosite e Polimiosite",
        "Doença Mista do Tecido Conjuntivo (DMTC)",
        "Vasculites sistêmicas",
      ],
    },
    {
      id: "articulares",
      title: "Doenças articulares inflamatórias",
      description:
        "Inflamações que atingem as articulações e a coluna, muitas vezes acompanhadas de rigidez ao acordar.",
      conditions: [
        "Espondilite Anquilosante",
        "Artrite Psoriásica",
        "Artrite Reativa",
        "Artrite Idiopática Juvenil",
        "Artrite Indiferenciada",
      ],
    },
    {
      id: "ossos",
      title: "Doenças dos ossos e do metabolismo",
      description:
        "Alterações no metabolismo dos ossos e das articulações, que afetam densidade, estrutura e funcionamento.",
      conditions: [
        "Osteoporose e osteopenia",
        "Osteomalácia / Raquitismo",
        "Doença de Paget",
        "Gota e pseudogota",
      ],
    },
    {
      id: "dores-cronicas",
      title: "Dores crônicas e partes moles",
      description:
        "Dores persistentes e condições que impactam corpo e mente, e que pedem escuta e uma abordagem integral.",
      conditions: [
        "Fibromialgia",
        "Síndrome miofascial",
        "Bursites, tendinites e tenossinovites",
        "Síndrome do ombro doloroso",
      ],
    },
    {
      id: "mulher",
      title: "Saúde da mulher e gestação",
      description:
        "Como doenças autoimunes e ósseas se relacionam com hormônios, gestação e menopausa.",
      conditions: [
        "Avaliação e acompanhamento de doenças durante a gestação",
        "Cuidados antes de engravidar",
        "Osteoporose pós-menopausa",
      ],
    },
    {
      id: "integral",
      title: "Medicina integral e dor crônica",
      description: "Ciência, mente e corpo juntos, em busca de bem-estar completo.",
      conditions: [
        "Gestão do estresse e equilíbrio emocional",
        "Alimentação anti-inflamatória",
        "Mindfulness e espiritualidade",
        "Movimento e terapias complementares com base científica",
      ],
    },
  ],
  notFound: "Não encontrou a sua condição?",
  cta: CTA_LABEL,
};

export const testimonials = {
  title: "Quem já passou pelo consultório",
  // Prints em /public/depoimentos/depoimento-01.png ... depoimento-08.png.
  // A seção só aparece quando os arquivos existem.
  files: Array.from(
    { length: 8 },
    (_, i) => `depoimento-${String(i + 1).padStart(2, "0")}.png`,
  ),
  alt: (n: number, total: number) =>
    `Depoimento de paciente da Dra. Caroline Vargas (${n} de ${total})`,
  prevLabel: "Depoimento anterior",
  nextLabel: "Próximo depoimento",
  openLabel: "Ampliar depoimento",
  closeLabel: "Fechar",
  cta: CTA_LABEL,
};

export const howToBook = {
  title: "Agendar é simples",
  steps: [
    {
      title: "Toque no botão",
      text: "A mensagem para o WhatsApp já vai pronta. É\u00a0só enviar.",
    },
    {
      title: "Combine o horário",
      text: "Você recebe o retorno para escolher o melhor dia e horário.",
    },
    {
      title: "Venha ao consultório",
      text: "Rua Dinamarca, 141, sala 303, bairro Nações, Balneário Camboriú/SC.",
    },
  ],
  cta: CTA_LABEL,
};

export const faq = {
  title: "Dúvidas frequentes",
  // Perguntas com answer: null dependem de confirmação da cliente
  // ([CONFIRMAR] na especificação) e NÃO são exibidas até serem respondidas.
  items: [
    {
      question: "Preciso ter um diagnóstico para marcar a consulta?",
      answer:
        "Não. Você pode marcar se sente dor, rigidez ou cansaço e quer entender a causa, mesmo sem nenhum diagnóstico.",
    },
    {
      question: "O que levar na primeira consulta?",
      answer:
        "Se tiver, leve exames e laudos anteriores e a lista dos medicamentos que usa. Isso ajuda a entender o seu histórico.",
    },
    { question: "A consulta é por convênio ou particular?", answer: null },
    { question: "Existe atendimento online?", answer: null },
    { question: "Quanto tempo dura a consulta?", answer: null },
  ] as { question: string; answer: string | null }[],
};

export const finalCta = {
  title: "Sua dor merece ser levada a sério.",
  text: "Agende uma consulta e receba um plano de cuidado personalizado para diagnóstico, tratamento e acompanhamento de doenças autoimunes, dores crônicas e inflamações articulares.",
  cta: CTA_LABEL,
};

export const contact = {
  name: "Dra. Caroline Vargas da Cruz",
  role: "Reumatologista",
  whatsappLabel: "WhatsApp",
  phoneDisplay: "(47) 99139-2555",
  instagramLabel: "Instagram",
  instagramHandle: "@dra.carolinereumato",
  instagramUrl: "https://www.instagram.com/dra.carolinereumato/",
  addressLabel: "Endereço",
  addressLines: ["Rua Dinamarca, 141,", "sala 303, Nações,", "Balneário Camboriú/SC"],
  mapLabel: "Ver no mapa",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Dinamarca+141+Nações+Balneário+Camboriú+SC",
  // CRM e RQE são obrigatórios (CFM). Pendência da cliente.
  responsible: [
    "Responsável técnica: Dra.\u00a0Caroline Vargas da Cruz,",
    "CRM/SC [NÚMERO], RQE [NÚMERO]",
  ],
  copyright: (year: number) => `© ${year} Dra. Caroline Vargas da Cruz`,
  backToTop: "Voltar ao topo",
};

export const whatsappFloat = {
  label: "Agendar consulta pelo WhatsApp",
};
