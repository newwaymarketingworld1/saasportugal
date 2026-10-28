# Site da Dra. Caroline Vargas da Cruz

Página única (Next.js 16, App Router, Tailwind v4). A especificação completa,
que é a fonte da verdade, está em `prompt-site-dra-caroline.md`.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Na Vercel, aponte o **Root Directory** do projeto para `sites/dra-caroline`.
Defina `NEXT_PUBLIC_SITE_URL` se o domínio final for outro que
`https://dra.carolinereumato.com.br` (usado em canonical, Open Graph, sitemap e JSON-LD).

## Onde mexer

| O quê | Onde |
|---|---|
| Toda a copy | `lib/content.ts` |
| Número e mensagem do WhatsApp | `lib/whatsapp.ts` (única fonte; todos os botões usam) |
| Cores e tipografia | `app/globals.css` |
| Fotos | `public/images/` |

## Pendências da cliente

1. **Depoimentos:** colocar os 8 prints em `public/depoimentos/`, com os nomes
   `depoimento-01.png` a `depoimento-08.png`, na ordem. A seção e o link
   "Depoimentos" do menu aparecem sozinhos no próximo build.
2. **CRM e RQE:** substituir os `[NÚMERO]` em `contact.responsible`
   (`lib/content.ts`). Obrigatório em publicidade médica (CFM).
3. **Dúvidas:** em `faq.items` (`lib/content.ts`), as perguntas com
   `answer: null` (convênio, atendimento online, duração da consulta) ficam
   ocultas. Basta escrever a resposta para que apareçam.
