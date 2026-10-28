# Prompt — Site da Dra. Caroline Vargas da Cruz (Reumatologista)

> **Leia este documento inteiro antes de escrever qualquer linha de código.**
> Ele define o conceito visual, a copy final, o layout de cada seção (desktop e mobile), os componentes, as regras técnicas e um protocolo obrigatório de revisão. Siga as fases na ordem. Não improvise onde o documento já decidiu.

---

## 0. Por que este documento existe

Este site já foi tentado quatro vezes e todas as versões saíram **genéricas e difíceis de usar**. Os erros que se repetiram, e que você está proibido de repetir:

- Visual de "template de clínica": fundo creme, serifa dramática, cards arredondados idênticos com sombra cinza, gradientes decorativos.
- Animação de fade-up em todas as seções e hover em todos os cards.
- Texto pequeno, cinza-claro, difícil de ler.
- Excesso de informação na mesma tela; o visitante não sabe onde clicar.
- Botões que não levavam ao WhatsApp, ou levavam com mensagem errada.

O objetivo é um site que pareça feito por um estúdio de design para **esta** médica, e que uma paciente de 65 anos com dor nas mãos consiga usar no celular sem ajuda.

---

## 1. Briefing

**Quem:** Dra. Caroline Vargas da Cruz, médica reumatologista. Consultório particular em Balneário Camboriú/SC. Formada pela UNIPLAC (2016), residência em Clínica Médica no Hospital Nossa Senhora da Conceição (Tubarão/SC), especialização em Reumatologia pela Santa Casa de Misericórdia de São Paulo.

**Diferencial real:** une medicina e espiritualidade numa abordagem integrativa (corpo, mente e espírito). Escuta sem pressa, plano de cuidado personalizado, acompanhamento contínuo.

**Para quem:** pessoas, majoritariamente mulheres de 30 a 70 anos, que convivem com dor crônica, rigidez, cansaço ou já têm diagnóstico de doença autoimune. Muitas já passaram por vários médicos e ouviram que "os exames estão normais". Chegam cansadas, desconfiadas e com dor. Muitas acessam pelo celular, vindas do Instagram.

**Única ação de conversão:** agendar consulta pelo WhatsApp.

**Sensação que o site deve passar:** calma, competência e acolhimento. "Aqui alguém vai me ouvir e vai saber o que fazer."

---

## 2. Regra do WhatsApp (crítica, sem exceção)

**Todos os botões do site** abrem o WhatsApp com a mensagem exata abaixo. Crie uma única constante e use em todo lugar. Nunca escreva a URL à mão em um componente.

```ts
// lib/whatsapp.ts
export const WHATSAPP_NUMBER = "5547991392555";
export const WHATSAPP_MESSAGE =
  "Olá, acabei de visitar o site da Dra. Caroline Vargas e gostaria de agendar uma consulta";
export const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
```

Crie um componente único `<WhatsAppButton />` (variantes `primary`, `inverse`, `compact`) e use-o em todos os CTAs. Ele sempre tem:

- `href={WHATSAPP_URL}`, `target="_blank"`, `rel="noopener noreferrer"`
- ícone do WhatsApp (SVG inline, não emoji) à esquerda do texto
- altura mínima de 52px (48px na variante `compact`)

**Botão flutuante:** círculo de 60px no canto inferior direito, cor `#25D366`, ícone branco, `aria-label="Agendar consulta pelo WhatsApp"`, respeitando `env(safe-area-inset-bottom)`. Ele **só aparece depois que o botão do hero sai da tela** (IntersectionObserver), para não competir com o CTA principal. Some quando a seção de CTA final está visível, pelo mesmo motivo.

Links do menu (Sobre, Especialidades etc.) são **âncoras de rolagem**, não botões. Instagram e "Ver no mapa" são links de texto, não botões.

---

## 3. Conceito visual: "Arco de movimento"

Na reumatologia, o **arco de movimento** é o ângulo que uma articulação consegue percorrer. Recuperar movimento é, literalmente, o que a paciente busca. Esse é o conceito do site e ele aparece em **dois lugares só**:

1. **As fotos da doutora são recortadas em formato de arco** (topo em semicírculo, base reta). O arco também evoca acolhimento e um espaço de recolhimento, ligando à dimensão espiritual do trabalho dela.
2. **No hero, uma linha fina em arco desenha-se uma única vez** ao redor do topo da foto ao carregar a página (de 0° a ~180°, em 1.4s, `ease-out`). É o **único momento de animação automática do site inteiro**. É o detalhe memorável. Tudo ao redor é quieto e disciplinado.

Não espalhe arcos pelo site como decoração. Não use o arco em ícones, divisores, fundos ou botões. A força do conceito vem da contenção.

### 3.1 Cores

Paleta inspirada na luz da costa de Balneário Camboriú: mar profundo, névoa, areia clara e um fio de sol de fim de tarde. Fundo **frio e mineral**, não creme.

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#16343A` | Texto principal, seção escura do CTA final, rodapé |
| `--paper` | `#F7F8F6` | Fundo principal (branco mineral, levemente frio) |
| `--mist` | `#E7EEEC` | Fundo das seções alternadas |
| `--sea` | `#2F6F68` | Cor de ação: botões, links, marcadores |
| `--sea-deep` | `#245852` | Hover dos botões |
| `--muted` | `#4C6164` | Texto secundário (contraste AA garantido sobre `--paper` e `--mist`) |
| `--line` | `#CFDAD7` | Bordas e divisores finos |
| `--sun` | `#C9973A` | **Somente** a linha do arco no hero e o marcador da linha do tempo. Nunca em texto. |

Regras:
- Texto corrido sempre em `--ink` ou `--muted`. Nunca cinza mais claro que `--muted`.
- Sem gradientes. Sem sombras decorativas. A única sombra permitida é a do botão flutuante.
- Preto puro não é usado; o "escuro" do site é `--ink`.

### 3.2 Tipografia

Duas famílias, com papéis bem distintos (carregar via `next/font/google`, `display: swap`):

- **Newsreader** (serifa editorial com tamanho óptico) para títulos H1 e H2 e para a citação da missão. Peso 400. Nunca negrito.
- **Hanken Grotesk** (sans humanista, muito legível) para todo o resto: corpo, menu, botões, listas, H3. Pesos 400 e 600.

Escala (pensada para leitura confortável por público 50+):

| Elemento | Fonte | Tamanho | Line-height | Tracking |
|---|---|---|---|---|
| H1 | Newsreader 400 | `clamp(2.5rem, 5vw + 0.5rem, 4.25rem)` | 1.06 | -0.02em |
| H2 | Newsreader 400 | `clamp(2rem, 3vw + 0.75rem, 3rem)` | 1.12 | -0.015em |
| H3 | Hanken 600 | `1.25rem` | 1.35 | 0 |
| Corpo grande (lead) | Hanken 400 | `1.25rem` | 1.6 | 0 |
| Corpo | Hanken 400 | `1.125rem` (18px) | 1.7 | 0 |
| Pequeno | Hanken 400 | `0.9375rem` | 1.55 | 0 |
| Botão | Hanken 600 | `1.0625rem` | 1 | 0.005em |

Regras:
- **Nenhum texto do site abaixo de 15px.** Corpo nunca abaixo de 18px.
- Linhas de texto com no máximo **62 caracteres** (`max-width: 62ch`).
- **Proibido** destacar uma palavra do título em itálico, cor diferente ou negrito.
- **Proibido** rótulos em CAIXA ALTA espaçada acima dos títulos (os famosos "eyebrows"). Os títulos se sustentam sozinhos.
- **Proibido** juntar informações com ponto médio ("A · B · C"). Use vírgulas ou quebras de linha.
- **Proibido** setas "→" coladas em textos de botão ou link.

### 3.3 Layout e ritmo

- Container máximo de **1200px**, grid de 12 colunas, gutter de 32px; padding lateral de 20px no mobile, 40px no desktop.
- Texto **alinhado à esquerda** em todo o site. A única exceção é o CTA final, centralizado.
- Padding vertical das seções: **128px no desktop, 80px no mobile.** Respiro é parte do design.
- Fundos alternam entre `--paper` e `--mist`; o CTA final é `--ink`.
- **Hierarquia de raios:** fotos em arco; botões em pílula; imagens de depoimento com 12px; nada mais tem raio. Não existem "cards" com borda e sombra neste site.
- Divisores: linha de 1px em `--line`, usada com parcimônia.

### 3.4 Movimento

- **Automático:** apenas o desenho do arco no hero (+ fade do conteúdo do hero em 500ms junto com ele). Mais nada se move sozinho.
- **Sem** fade-up nas seções ao rolar. **Sem** parallax. **Sem** hover que levanta cards.
- **Em resposta à ação da usuária:** accordion abrindo (altura animada, 250ms), troca de especialidade no desktop (crossfade 200ms), botão escurecendo no hover (150ms), menu mobile abrindo (200ms).
- `prefers-reduced-motion: reduce` → o arco já aparece desenhado, sem animação nenhuma.

---

## 4. Stack e estrutura de arquivos

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** só para o arco do hero e o crossfade das especialidades
- Ícones: **lucide-react**, `strokeWidth={1.5}`
- Imagens: `next/image`, arquivos locais em `/public`, formatos modernos, `sizes` corretos, `priority` só na foto do hero
- `<html lang="pt-BR">`
- Deploy na Vercel

```
app/
  layout.tsx          // fontes, metadados, JSON-LD
  page.tsx            // monta as seções na ordem
components/
  site-header.tsx
  whatsapp-button.tsx
  whatsapp-float.tsx
  arch-photo.tsx      // foto recortada em arco (reutilizada no hero e no Sobre)
  sections/
    hero.tsx
    recognize.tsx
    approach.tsx
    about.tsx
    specialties.tsx
    testimonials.tsx
    how-to-book.tsx
    faq.tsx
    final-cta.tsx
    site-footer.tsx
lib/
  whatsapp.ts
  content.ts          // TODA a copy do site centralizada aqui
public/
  images/
  depoimentos/
```

**Toda a copy fica em `lib/content.ts`**, não espalhada nos componentes. Isso facilita a revisão da cliente.

---

## 5. Componentes da 21st.dev

Use estes componentes como **ponto de partida estrutural**, não como design final. Antes de usar cada um, abra o preview, confira se a estrutura serve e então **remova todo o estilo de demo** (cores, fontes, sombras, cards, gradientes, animações de entrada) e aplique os tokens da seção 3. Se um componente não servir, construa a seção do zero seguindo o wireframe. **O wireframe deste documento sempre vence o componente.**

```bash
# Header sticky com blur e menu mobile
npx shadcn@latest add "https://21st.dev/r/efferd/header-1?api_key=$API_KEY_21ST"

# Lista interativa que troca conteúdo ao selecionar (base da seção Especialidades no desktop)
npx shadcn@latest add "https://21st.dev/r/felipemenezes098/feature-01?api_key=$API_KEY_21ST"

# Seção dividida texto + imagem (base do Sobre)
npx shadcn@latest add "https://21st.dev/r/felipemenezes098/content-06?api_key=$API_KEY_21ST"

# Accordion acessível (Especialidades no mobile + FAQ)
npx shadcn@latest add "https://21st.dev/r/wensity/accordion?api_key=$API_KEY_21ST"

# Carrossel com swipe e dots (base dos Depoimentos)
npx shadcn@latest add "https://21st.dev/r/ziegfiroyt/testimonial1?api_key=$API_KEY_21ST"
```

O **hero não usa componente pronto**: ele é construído do zero, porque o arco é o elemento autoral do site.

> Plano gratuito da 21st permite 2 instalações por dia. Prioridade: `feature-01` e `accordion`. O resto pode ser construído à mão pelo wireframe.

---

## 6. Seções: wireframe, comportamento e copy final

A ordem da página é exatamente esta. Use a copy **literalmente**, com a acentuação exata.

### 6.1 Header

```
DESKTOP
┌──────────────────────────────────────────────────────────────────────┐
│ Dra. Caroline Vargas          Sobre  Especialidades  Depoimentos      │
│ Reumatologista                Dúvidas  Contato     [ Agendar consulta ]│
└──────────────────────────────────────────────────────────────────────┘
MOBILE
┌──────────────────────────────┐
│ Dra. Caroline Vargas     ☰   │
│ Reumatologista               │
└──────────────────────────────┘
```

- Altura 76px desktop / 64px mobile. Fundo `--paper` transparente no topo; ao rolar, `--paper` com 92% de opacidade, `backdrop-blur` e linha inferior de 1px `--line`.
- Marca: "Dra. Caroline Vargas" em Newsreader 1.375rem `--ink`; "Reumatologista" embaixo em Hanken 0.875rem `--muted`.
- Links: Hanken 600, 0.9375rem, `--ink`; hover sublinhado de 1px com offset 6px.
- Botão: `<WhatsAppButton variant="compact">Agendar consulta</WhatsAppButton>`
- **Mobile:** o ☰ abre um painel de tela cheia em `--paper` com os links em Newsreader 2rem, empilhados com 24px de espaço, e o botão de WhatsApp grande no rodapé do painel. Fecha ao tocar em um link, no X ou com ESC. Trava a rolagem do body enquanto aberto.
- Âncoras: `#sobre`, `#especialidades`, `#depoimentos`, `#duvidas`, `#contato`. Todas as seções com `scroll-margin-top: 96px`.

### 6.2 Hero (`#inicio`)

```
DESKTOP (fundo --paper)
┌──────────────────────────────────────────────────────────────────────┐
│                                                   ╭──────────╮        │
│  Reumatologista em Balneário Camboriú           ╱   (arco    ╲       │
│                                                 │  desenhando)│      │
│  Dor que não passa                              │   ┌──────┐  │      │
│  tem causa. E merece                            │   │ FOTO │  │      │
│  ser investigada                                │   │ ARCO │  │      │
│  com calma.                                     │   │      │  │      │
│                                                 │   └──────┘  │      │
│  Texto de apoio (lead), até 2 linhas e meia...                       │
│                                                                      │
│  [ ◎ Agendar consulta pelo WhatsApp ]                                │
│                                                                      │
│  Especialista em Reumatologia pela Santa Casa de São Paulo           │
│  Consultório no bairro Nações, em Balneário Camboriú                 │
└──────────────────────────────────────────────────────────────────────┘
  colunas: texto 1–7 | foto 8–12, foto alinhada pela base do texto

MOBILE
┌──────────────────────────────┐
│ Reumatologista em Balneário  │
│ Camboriú                     │
│                              │
│ Dor que não passa tem causa. │
│ E merece ser investigada     │
│ com calma.                   │
│                              │
│ Lead (texto de apoio)        │
│ [ Agendar consulta pelo WA ] │  ← visível sem rolar em 390×844
│ Linhas de credencial         │
│      ╭────────╮              │
│     │  FOTO   │  (arco)      │
│     │  ARCO   │              │
└──────────────────────────────┘
```

**Copy:**
- Linha de contexto (Hanken 600, 1rem, `--sea`, caixa normal): **Reumatologista em Balneário Camboriú**
- H1: **Dor que não passa tem causa. E merece ser investigada com calma.**
- Lead: **Sou a Dra. Caroline Vargas da Cruz. Cuido de pessoas que convivem com dores nas articulações, doenças autoimunes e cansaço sem explicação, com tempo para ouvir a sua história e um plano de cuidado feito para você.**
- Botão: **Agendar consulta pelo WhatsApp**
- Credenciais (Hanken 0.9375rem, `--muted`, uma por linha, com ícone `GraduationCap` e `MapPin` de 18px):
  - **Especialista em Reumatologia pela Santa Casa de São Paulo**
  - **Consultório no bairro Nações, em Balneário Camboriú**

**Foto e arco:**
- Foto: `IMG_1428` (lista na seção 7). Componente `<ArchPhoto>`: `border-radius: 999px 999px 0 0` (topo semicircular), proporção 4:5, `object-fit: cover`, `object-position` ajustado para o rosto ficar no terço superior. Largura ~420px no desktop, ~78% da tela no mobile.
- Arco: SVG absoluto, concêntrico ao topo da foto, 14px afastado da borda, `stroke: var(--sun)`, `stroke-width: 1.5`, sem preenchimento, `stroke-linecap: round`. Anima `pathLength` de 0 a 1 em 1.4s com `ease-out`, iniciando 300ms após o carregamento. Em reduced-motion já aparece completo.
- Alt da foto: "Dra. Caroline Vargas da Cruz, reumatologista em Balneário Camboriú"

### 6.3 Você se reconhece? (`#reumatologia`)

```
DESKTOP (fundo --mist)
┌──────────────────────────────────────────────────────────────────────┐
│  H2 (col 1–5)                    Lista de sinais (col 7–12)           │
│  Talvez seja hora de             ✓ sente dores constantes...          │
│  procurar uma                    ──────────────────────────           │
│  reumatologista se você...       ✓ acorda com o corpo rígido...       │
│                                  ──────────────────────────           │
│  Parágrafo explicativo           ✓ já tem diagnóstico de...           │
│  sobre a reumatologia            ──────────────────────────           │
│  (col 1–5)                       ✓ fez exames, ouviu que...           │
│                                  ──────────────────────────           │
│                                  ✓ quer entender por que...           │
│                                                                      │
│                                  [ Agendar consulta pelo WhatsApp ]   │
└──────────────────────────────────────────────────────────────────────┘
MOBILE: H2, parágrafo, lista, botão (empilhados)
```

**Copy:**
- H2: **Talvez seja hora de procurar uma reumatologista se você...**
- Parágrafo: **A reumatologia vai além das articulações. Ela olha para o corpo inteiro: como ele reage à dor, à rigidez, ao cansaço e até ao estresse. O objetivo é descobrir o que está causando seus sintomas e orientar o cuidado certo.**
- Lista (Hanken 1.1875rem, `--ink`, ícone `Check` 20px `--sea`, divisores de 1px `--line` entre itens, 20px de padding vertical por item):
  1. **sente dores constantes nas articulações, nas costas ou nos músculos;**
  2. **acorda com o corpo rígido, inchado ou sem energia;**
  3. **já tem diagnóstico de lúpus, artrite reumatoide, esclerodermia ou outra doença autoimune;**
  4. **fez exames, ouviu que está tudo normal, mas a dor continua;**
  5. **ou simplesmente quer entender por que sente dor e como o seu corpo funciona.**
- Botão: **Agendar consulta pelo WhatsApp**

### 6.4 Como eu cuido (`#abordagem`)

```
DESKTOP (fundo --paper)
┌──────────────────────────────────────────────────────────────────────┐
│  H2 grande, ocupando col 1–9, até 2 linhas                           │
│  Mais do que aliviar sintomas, entender de onde vem a dor.           │
│                                                                      │
│  Lead (col 1–7)                                                      │
│                                                                      │
│  ───────────────────────────  ─────────────────────────────          │
│  Escuta sem pressa            Corpo, mente e espírito                │
│  texto curto                  texto curto                            │
│                                                                      │
│  ───────────────────────────  ─────────────────────────────          │
│  Um plano feito para você     Acompanhamento próximo                 │
│  texto curto                  texto curto                            │
└──────────────────────────────────────────────────────────────────────┘
  Os 4 itens: grid 2×2, cada um com linha de 1px --line no topo,
  24px de respiro, título H3 e texto. SEM card, SEM fundo, SEM sombra,
  SEM números. MOBILE: 1 coluna.
```

**Copy:**
- H2: **Mais do que aliviar sintomas, entender de onde vem a dor.**
- Lead: **A dor tem uma dimensão física, emocional e espiritual. Por isso, o cuidado começa pela escuta: o seu tempo, a sua história e a sua rotina fazem parte do diagnóstico.**
- Itens:
  - **Escuta sem pressa** — Espaço para contar a sua história com calma, sendo ouvida de verdade.
  - **Corpo, mente e espírito** — Uma abordagem integrativa, que considera emoções, estresse e espiritualidade junto com exames e tratamento.
  - **Um plano feito para você** — Cuidado personalizado, construído com você e ajustado ao longo do tempo.
  - **Acompanhamento próximo** — Doenças reumatológicas pedem acompanhamento contínuo, e não consultas soltas.

(Nos itens, o travessão separa título de texto apenas neste documento. No site, título é H3 e texto é parágrafo.)

### 6.5 Sobre (`#sobre`)

```
DESKTOP (fundo --mist)
┌──────────────────────────────────────────────────────────────────────┐
│   ╭────────╮        H2                                               │
│  │  FOTO   │        Prazer, sou a Dra. Caroline Vargas da Cruz.      │
│  │  ARCO   │                                                         │
│  │ (sem    │        Parágrafo 1 (história)                           │
│  │  linha) │        Parágrafo 2                                      │
│  │         │                                                         │
│  └─────────┘        ┃ Citação da missão (Newsreader, 1.625rem)       │
│   col 1–5           col 7–12                                         │
│                                                                      │
│  Formação (linha do tempo horizontal, col 1–12)                      │
│  ●───────────────●───────────────●───────────────●                   │
│  Medicina        Residência      Reumatologia     Hoje               │
│  UNIPLAC, 2016   Clínica Médica  Santa Casa SP    Consultório em BC  │
│                                                                      │
│  [ Agendar consulta pelo WhatsApp ]                                  │
└──────────────────────────────────────────────────────────────────────┘
MOBILE: foto, H2, textos, citação, linha do tempo VERTICAL, botão
```

**Copy:**
- H2: **Prazer, sou a Dra. Caroline Vargas da Cruz.**
- Parágrafo 1: **Me encantei pela Reumatologia ainda no terceiro ano da faculdade, pela profundidade da escuta, pela complexidade dos diagnósticos e, principalmente, pela necessidade de enxergar o paciente de forma integral: corpo, mente e alma em movimento.**
- Parágrafo 2: **Hoje atendo em consultório particular, unindo Medicina e Espiritualidade em um modelo de cuidado que valoriza o autoconhecimento, o equilíbrio emocional e a participação de cada paciente no próprio tratamento.**
- Citação (Newsreader 400, 1.625rem, line-height 1.35, `--ink`, borda esquerda de 2px `--sea`, padding-left 24px): **Minha missão é ajudar pessoas com dores crônicas a reencontrarem vitalidade, propósito e paz, através de um olhar humano, integrativo e consciente.**
- Linha do tempo (é uma sequência real, por isso usa marcadores). Marcadores: círculos de 10px em `--sun`; linha de 1px `--line`. Título em Hanken 600, detalhe em Hanken 400 `--muted`:
  1. **Medicina** — Universidade do Planalto Catarinense (UNIPLAC), Lages/SC, 2016
  2. **Residência em Clínica Médica** — Hospital Nossa Senhora da Conceição, Tubarão/SC
  3. **Especialização em Reumatologia** — Irmandade da Santa Casa de Misericórdia de São Paulo
  4. **Hoje** — Consultório particular em Balneário Camboriú/SC
- Foto: `IMG_1426`, mesmo `<ArchPhoto>`, **sem** a linha do arco (ela é exclusiva do hero).
- Botão: **Agendar consulta pelo WhatsApp**

### 6.6 Especialidades (`#especialidades`)

Esta é a seção mais densa do site. O desafio é mostrar **6 áreas e 30 condições** sem virar um muro de texto. Solução: **índice + painel**.

```
DESKTOP (fundo --paper)
┌──────────────────────────────────────────────────────────────────────┐
│  H2: O que eu trato                                                  │
│  Lead curto                                                          │
│                                                                      │
│  ÍNDICE (col 1–5)               PAINEL (col 7–12)                    │
│  ▌Doenças autoimunes ◀ ativo    Doenças autoimunes (H3 grande)       │
│   Doenças articulares inflam.   Descrição em 1–2 linhas              │
│   Doenças dos ossos             ─────────────────────                │
│   Dores crônicas e partes moles Condições tratadas:                  │
│   Saúde da mulher e gestação    • Lúpus Eritematoso Sistêmico (LES)  │
│   Medicina integral e dor       • Artrite Reumatoide (AR)            │
│                                 • ... (lista em 2 colunas se > 5)    │
└──────────────────────────────────────────────────────────────────────┘
```

- **Desktop (≥1024px):** índice à esquerda como lista de `<button role="tab">`, Hanken 600 1.125rem, padding 16px 0, divisor `--line` entre itens. Item ativo: texto `--ink` e barra vertical de 3px `--sea` à esquerda; inativos em `--muted`. Painel à direita como `role="tabpanel"`, troca com crossfade de 200ms. Navegação por setas ↑↓ no teclado. Primeiro item ativo por padrão. Altura do painel fixada pela maior lista para a página não "pular".
- **Mobile e tablet (<1024px):** accordion. Cada área é um item; o título é o gatilho; ao abrir mostra descrição + lista. Só um aberto por vez. Primeiro aberto por padrão. Área de toque de 56px.

**Copy:**
- H2: **O que eu trato**
- Lead: **Seis áreas de atuação, com as principais condições de cada uma. Se a sua não estiver aqui, me envie uma mensagem.**

1. **Doenças autoimunes**
   Quando o corpo, por engano, passa a atacar a si mesmo, causando dor, cansaço e inflamação.
   Lúpus Eritematoso Sistêmico (LES); Artrite Reumatoide (AR); Esclerodermia / Esclerose Sistêmica; Síndrome de Sjögren; Dermatomiosite e Polimiosite; Doença Mista do Tecido Conjuntivo (DMTC); Vasculites sistêmicas.

2. **Doenças articulares inflamatórias**
   Inflamações que atingem as articulações e a coluna, muitas vezes acompanhadas de rigidez ao acordar.
   Espondilite Anquilosante; Artrite Psoriásica; Artrite Reativa; Artrite Idiopática Juvenil; Artrite Indiferenciada.

3. **Doenças dos ossos e do metabolismo**
   Alterações no metabolismo dos ossos e das articulações, que afetam densidade, estrutura e funcionamento.
   Osteoporose e osteopenia; Osteomalácia / Raquitismo; Doença de Paget; Gota e pseudogota.

4. **Dores crônicas e partes moles**
   Dores persistentes e condições que impactam corpo e mente, e que pedem escuta e uma abordagem integral.
   Fibromialgia; Síndrome miofascial; Bursites, tendinites e tenossinovites; Síndrome do ombro doloroso.

5. **Saúde da mulher e gestação**
   Como doenças autoimunes e ósseas se relacionam com hormônios, gestação e menopausa.
   Avaliação e acompanhamento de doenças durante a gestação; Cuidados antes de engravidar; Osteoporose pós-menopausa.

6. **Medicina integral e dor crônica**
   Ciência, mente e corpo juntos, em busca de bem-estar completo.
   Gestão do estresse e equilíbrio emocional; Alimentação anti-inflamatória; Mindfulness e espiritualidade; Movimento e terapias complementares com base científica.

- Abaixo do índice/painel: texto **Não encontrou a sua condição?** + `<WhatsAppButton>` **Agendar consulta pelo WhatsApp**

### 6.7 Depoimentos (`#depoimentos`)

```
DESKTOP (fundo --mist)
┌──────────────────────────────────────────────────────────────────────┐
│  H2: Quem já passou pelo consultório          ( ‹ )  ( › )           │
│                                                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──                               │
│  │ print  │ │ print  │ │ print  │ │  (3 visíveis + 1 cortado,        │
│  │        │ │        │ │        │ │   indicando que rola)            │
│  └────────┘ └────────┘ └────────┘ └──                               │
│                  ●  ○  ○  ○  ○  ○                                    │
│  [ Agendar consulta pelo WhatsApp ]                                  │
└──────────────────────────────────────────────────────────────────────┘
MOBILE: 1 imagem + pedaço da próxima visível, swipe, dots
```

- Os depoimentos são **imagens (prints)**. Carrossel com scroll-snap horizontal, swipe no toque, setas no desktop (botões circulares de 44px, borda 1px `--line`), dots abaixo. **Sem autoplay** (pacientes leem devagar).
- Imagens com raio de 12px, borda 1px `--line`, fundo branco, `object-fit: contain`, altura uniforme.
- Toque/clique abre a imagem ampliada em um `Dialog` do shadcn, com navegação anterior/próxima e fechamento por ESC, X ou toque fora.
- Alt de cada imagem: "Depoimento de paciente da Dra. Caroline Vargas (n de 8)"

**Copy:**
- H2: **Quem já passou pelo consultório**
- Botão: **Agendar consulta pelo WhatsApp**

### 6.8 Como agendar (`#agendar`)

É uma sequência real, por isso usa números.

```
DESKTOP (fundo --paper)
┌──────────────────────────────────────────────────────────────────────┐
│  H2: Agendar é simples                                               │
│                                                                      │
│  1                      2                       3                    │
│  Toque no botão         Combine o horário       Venha ao consultório │
│  texto                  texto                   texto + endereço     │
│                                                                      │
│  [ Agendar consulta pelo WhatsApp ]                                  │
└──────────────────────────────────────────────────────────────────────┘
MOBILE: passos empilhados com linha vertical conectando os números
```

- Números em Newsreader 3rem `--sea`.

**Copy:**
- H2: **Agendar é simples**
- Passo 1: **Toque no botão** — A mensagem para o WhatsApp já vai pronta. É só enviar.
- Passo 2: **Combine o horário** — Você recebe o retorno para escolher o melhor dia e horário.
- Passo 3: **Venha ao consultório** — Rua Dinamarca, 141, sala 303, bairro Nações, Balneário Camboriú/SC.
- Botão: **Agendar consulta pelo WhatsApp**

### 6.9 Dúvidas (`#duvidas`)

> **Atenção:** as respostas marcadas com `[CONFIRMAR]` dependem de informação da cliente. **Não invente.** Se a informação não for fornecida, **remova a pergunta** antes de publicar. Se todas forem removidas, remova a seção e o link "Dúvidas" do menu.

- Accordion, fundo `--mist`, itens separados por linha de 1px `--line`, pergunta em Hanken 600 1.1875rem, ícone `Plus` que gira 45° ao abrir. Vários podem ficar abertos.

**Copy:**
- H2: **Dúvidas frequentes**
- **Preciso ter um diagnóstico para marcar a consulta?**
  Não. Você pode marcar se sente dor, rigidez ou cansaço e quer entender a causa, mesmo sem nenhum diagnóstico.
- **O que levar na primeira consulta?**
  Se tiver, leve exames e laudos anteriores e a lista dos medicamentos que usa. Isso ajuda a entender o seu histórico.
- **A consulta é por convênio ou particular?**
  `[CONFIRMAR]`
- **Existe atendimento online?**
  `[CONFIRMAR]`
- **Quanto tempo dura a consulta?**
  `[CONFIRMAR]`

### 6.10 CTA final

```
(fundo --ink, texto --paper, tudo centralizado)
┌──────────────────────────────────────────────────────────────────────┐
│               Sua dor merece ser levada a sério.                     │
│        Texto de apoio, no máximo 2 linhas, max-width 56ch            │
│              [ Agendar consulta pelo WhatsApp ]   (inverse)          │
└──────────────────────────────────────────────────────────────────────┘
```

- Padding 128px desktop / 96px mobile. Botão variante `inverse`: fundo `--paper`, texto `--ink`, hover `--mist`.

**Copy:**
- H2: **Sua dor merece ser levada a sério.**
- Texto: **Agende uma consulta e receba um plano de cuidado personalizado para diagnóstico, tratamento e acompanhamento de doenças autoimunes, dores crônicas e inflamações articulares.**
- Botão: **Agendar consulta pelo WhatsApp**

### 6.11 Contato e rodapé (`#contato`)

```
(fundo --ink continua, separado do CTA por linha 1px rgba(247,248,246,.15))
┌──────────────────────────────────────────────────────────────────────┐
│  Dra. Caroline Vargas da Cruz                                        │
│  Reumatologista                                                      │
│                                                                      │
│  WhatsApp            Instagram              Endereço                 │
│  (47) 99139-2555     @dra.carolinereumato   Rua Dinamarca, 141,      │
│                                             sala 303, Nações,        │
│                                             Balneário Camboriú/SC    │
│                                             Ver no mapa              │
│  ─────────────────────────────────────────────────────────────       │
│  Responsável técnica: Dra. Caroline Vargas da Cruz,                  │
│  CRM/SC [NÚMERO], RQE [NÚMERO]                                       │
│  © 2026 Dra. Caroline Vargas da Cruz            Voltar ao topo       │
└──────────────────────────────────────────────────────────────────────┘
MOBILE: tudo empilhado
```

- Telefone: link para `WHATSAPP_URL`.
- Instagram: `https://www.instagram.com/dra.carolinereumato/` (nova aba).
- "Ver no mapa": `https://www.google.com/maps/search/?api=1&query=Rua+Dinamarca+141+Nações+Balneário+Camboriú+SC` (nova aba).
- Rótulos (WhatsApp, Instagram, Endereço) em Hanken 600 0.9375rem com 70% de opacidade; valores em Hanken 400 1.0625rem.
- **CRM e RQE são obrigatórios em publicidade médica (CFM).** Deixe os placeholders `[NÚMERO]` bem visíveis e liste-os no relatório final como pendência.
- Ano gerado dinamicamente.

---

## 7. Imagens

Baixe para `/public` e otimize. Não use imagens de banco de pessoas ou consultórios. Onde faltar imagem, o layout funciona só com tipografia.

**Fotos da doutora** → `/public/images/`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/IMG_1428-Caroline-Vargas-Da-Cruz-683x1024.jpeg` → `caroline-hero.jpg` (hero, Open Graph)
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/IMG_1426-Caroline-Vargas-Da-Cruz-683x1024.jpeg` → `caroline-sobre.jpg` (Sobre)

Se existirem versões em maior resolução no servidor (sem o sufixo `-683x1024`), prefira-as.

**Depoimentos** → `/public/depoimentos/` (`depoimento-01.png` a `depoimento-08.png`, na ordem)
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/3-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/4-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/5-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/6-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/7-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/8-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/9-2.png`
- `https://dra.carolinereumato.com.br/wp-content/uploads/2025/10/10-2.png`

Se algum download falhar, **pare e avise**, não substitua por placeholder genérico.

---

## 8. SEO e metadados

- `title`: **Dra. Caroline Vargas da Cruz | Reumatologista em Balneário Camboriú**
- `description`: **Reumatologista em Balneário Camboriú com atendimento humanizado e integrativo para dores crônicas, doenças autoimunes, artrite, fibromialgia e osteoporose. Agende sua consulta pelo WhatsApp.**
- Open Graph e Twitter Card: imagem 1200×630 gerada a partir de `caroline-hero.jpg` (foto à direita, nome e especialidade à esquerda em Newsreader sobre `--paper`).
- Favicon e apple-touch-icon: "CV" em Newsreader `--paper` sobre `--ink`.
- JSON-LD `Physician`:
  - `name`, `medicalSpecialty: "Rheumatology"`, `telephone: "+55-47-99139-2555"`
  - `address` (`PostalAddress`): Rua Dinamarca, 141, sala 303, Nações, Balneário Camboriú, SC, BR
  - `areaServed: "Balneário Camboriú"`, `sameAs: ["https://www.instagram.com/dra.carolinereumato/"]`
- Um único H1. Hierarquia H2/H3 correta. Headings nunca usados só para estilo.
- `sitemap.xml`, `robots.txt`, `canonical`.

---

## 9. Acessibilidade e qualidade técnica

- Contraste WCAG AA em todo texto (verifique `--muted` sobre `--mist` e `--paper` sobre `--ink`).
- Skip link "Ir para o conteúdo" como primeiro elemento focável.
- Foco visível em tudo: `outline: 2px solid var(--sea); outline-offset: 3px` (no fundo `--ink`, use `--paper`).
- Navegação completa por teclado: menu, tabs de especialidades, accordion, carrossel, dialog.
- Áreas de toque de no mínimo 48×48px.
- Zero overflow horizontal em qualquer largura (teste com `document.documentElement.scrollWidth`).
- Lighthouse mobile: **mínimo 95** em Performance, Acessibilidade, Boas Práticas e SEO.
- Zero erros de console, zero avisos de hidratação.
- Layout sem saltos (CLS < 0.05): reserve espaço para imagens e fontes.

---

## 10. Proibido

- Inventar informações: preços, convênios, tempo de consulta, número de pacientes, prêmios, anos de experiência.
- Promessas de cura ou de resultado (regras de publicidade médica do CFM).
- Formulário de contato. O único canal é o WhatsApp.
- Emojis no layout.
- Cards com borda e sombra, gradientes, glassmorphism, blobs decorativos.
- Eyebrows em caixa alta, ponto médio entre itens, setas em botões, uma palavra destacada no título.
- Animação de entrada nas seções, parallax, autoplay no carrossel.
- Fundo creme/bege. O fundo é `--paper` (#F7F8F6).
- Fontes Inter, Playfair, Fraunces, Poppins ou Montserrat.
- Alterar a copy. Se achar algum problema, liste no relatório em vez de mudar.

---

## 11. Fases de execução

1. **Setup:** projeto, fontes, tokens no `tailwind.config` e no `globals.css`, `lib/whatsapp.ts`, `lib/content.ts` com toda a copy.
2. **Esqueleto:** header, rodapé, `<WhatsAppButton>`, `<ArchPhoto>`, botão flutuante. Confirme que os links do WhatsApp abrem com a mensagem certa.
3. **Hero:** construa e revise isoladamente até ficar perfeito, inclusive a animação do arco e o mobile em 390px. **O hero define o nível do site inteiro.**
4. **Seções 6.3 a 6.11**, na ordem.
5. **SEO e metadados.**
6. **Protocolo de revisão** (seção 12). Obrigatório.

---

## 12. Protocolo de revisão visual (obrigatório)

Você só termina quando passar por este protocolo **pelo menos duas vezes**.

1. Rode o site e, com Playwright, tire screenshots de página inteira em **375, 390, 768, 1024, 1280 e 1536px** de largura.
2. Olhe cada screenshot e compare com os wireframes da seção 6. Para cada largura, responda:
   - O botão de WhatsApp do hero aparece sem rolar em 390×844?
   - Algum texto quebrou de forma feia (palavra sozinha na última linha de título, hifenização estranha)? Use `text-wrap: balance` nos títulos e `text-wrap: pretty` nos parágrafos.
   - Os espaçamentos verticais entre seções são idênticos?
   - Algum elemento encosta na borda da tela ou causa rolagem horizontal?
   - A foto do hero está com o rosto bem enquadrado dentro do arco?
   - O arco do hero está concêntrico e uniforme em relação à foto?
   - Alguma coisa parece "template"? Se sim, simplifique.
3. Teste funcional:
   - Clique em **todos** os botões e confirme a URL `https://wa.me/5547991392555?text=Ol%C3%A1%2C%20acabei%20de%20visitar%20o%20site%20da%20Dra.%20Caroline%20Vargas%20e%20gostaria%20de%20agendar%20uma%20consulta`
   - Todas as âncoras do menu (desktop e mobile) rolam para a seção certa, sem o título ficar escondido atrás do header.
   - O menu mobile fecha ao tocar num link.
   - Tabs das especialidades funcionam com mouse e teclado; o accordion funciona no mobile.
   - Carrossel com swipe e dialog de depoimentos funcionando.
   - O botão flutuante aparece/some nos momentos certos.
4. Rode o Lighthouse mobile e corrija até atingir 95+ nas quatro categorias.
5. Corrija tudo e repita.
6. **Por último, aplique o conselho de Chanel:** olhe o site inteiro e remova um elemento que não precisa estar ali.

---

## 13. Entrega

Ao terminar, entregue um relatório curto com:

- Os screenshots finais de 390px e 1280px.
- A pontuação do Lighthouse.
- **Pendências para a cliente:** número do CRM, número do RQE, respostas das perguntas `[CONFIRMAR]` do FAQ.
- Qualquer problema de copy que você notou (sem ter alterado).
- O que você removeu no passo final da revisão.
