# NewWay Marketing World — Sistema de Briefing

Sistema web para coletar, de cada cliente, a descrição detalhada da empresa, dos serviços e dos produtos — a matéria‑prima para criar os agentes de atendimento com IA (Google Gemini).

- **Página pública** `/briefing` — o cliente responde, sem login.
- **Painel privado** `/admin` — a equipe NewWay vê, busca, filtra, anota e exporta os briefings.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Zod · Vercel.

---

## Estrutura

```
supabase/schema.sql              Tabelas + políticas RLS (rodar no Supabase)
src/middleware.ts                Protege /admin/* (redireciona para /admin/login)
src/app/briefing/                Página pública + formulário
src/app/api/briefing/route.ts    Recebe o briefing (service role, honeypot, rate limit, Zod)
src/app/admin/login/             Login (Server Action → cookies httpOnly)
src/app/admin/(painel)/          Lista e detalhe dos briefings
src/app/api/admin/briefings/     PATCH (status/notas) e exportação .txt/.md
src/lib/                         Schemas Zod, clientes Supabase, rate limit, formatação
public/logo.svg                  Placeholder do logo (substitua pelo oficial)
public/fonts/                    Coloque aqui a fonte Azonix
```

---

## 1. Configurar o Supabase

1. Crie um projeto em <https://supabase.com> (região São Paulo, se disponível).
2. Abra **SQL Editor → New query**, cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria:
   - `briefings` (com a coluna extra `answer_length`, calculada pelo banco),
   - `admins` (e‑mails autorizados a usar o painel),
   - `rate_limits` (controle anti‑spam; guarda apenas hash do IP),
   - a função `is_admin()` e todas as políticas de **Row Level Security**.
3. Em **Project Settings → API**, copie:
   - **Project URL**
   - **anon public key**
   - **service_role key** (⚠️ segredo — nunca no front, nunca no Git)

### Como a segurança funciona

| Quem | Pode |
|---|---|
| Público (anon) | **Nada** direto no banco. O envio passa pela rota `/api/briefing`, que valida, aplica rate limit e insere com a *service role key* no servidor. Não existe política de INSERT/SELECT para `anon`. |
| Usuário logado **que está em `admins`** | Ler briefings e atualizar apenas `status` e `internal_notes` (privilégio por coluna). |
| Usuário logado fora de `admins` | Nada (e o middleware encerra a sessão dele). |

## 2. Criar o primeiro admin

Não há cadastro público. Os admins são criados manualmente:

1. No Supabase: **Authentication → Users → Add user → Create new user**. Informe e‑mail e senha e marque **Auto Confirm User**.
2. Em **SQL Editor**, autorize o e‑mail (em letras minúsculas):

   ```sql
   insert into public.admins (email) values ('voce@suaagencia.com.br')
   on conflict (email) do nothing;
   ```
3. Recomendado: em **Authentication → Providers → Email**, desative **Allow new users to sign up** (ninguém além de você cria contas).

Para adicionar outras pessoas, repita os dois passos. Para remover o acesso, apague a linha em `admins`.

## 3. Rodar localmente

Requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env.local
```

Preencha o `.env.local`:

| Variável | Onde obter |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `IP_HASH_SALT` | Texto aleatório: `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | (opcional) URL pública final do site |

```bash
npm run dev
```

- Briefing: <http://localhost:3000/briefing> (teste também `/briefing?cliente=decalck`)
- Painel: <http://localhost:3000/admin>

Comandos úteis: `npm run build`, `npm run lint`, `npm run typecheck`.

## 4. Deploy na Vercel

1. Suba o projeto para um repositório no GitHub (o `.gitignore` já exclui `.env.local`).
2. Na Vercel: **Add New → Project** → importe o repositório (framework: Next.js, detectado automaticamente).
3. Em **Settings → Environment Variables**, cadastre as mesmas variáveis do `.env.local` (marque Production, Preview e Development). A `SUPABASE_SERVICE_ROLE_KEY` **não** deve ter o prefixo `NEXT_PUBLIC_`.
4. Faça o **Deploy**. Depois, se usar domínio próprio, configure‑o em **Settings → Domains** e preencha `NEXT_PUBLIC_SITE_URL`.
5. Teste: envie um briefing em `/briefing`, entre em `/admin` e confirme que ele aparece.

> Cada cliente pode receber um link próprio: `https://SEU-DOMINIO/briefing?cliente=nome-do-cliente`. O identificador (letras minúsculas, números, `-` e `_`) é salvo junto do briefing.

## 5. Identidade visual

- **Cores:** preto `#0A0A0A`, branco, amarelo `#FFD600` (destaque). Definidas em `tailwind.config.ts`.
- **Logo:** substitua `public/logo.svg` pelo arquivo oficial.
- **Azonix:** coloque `Azonix.otf` (ou `.woff2`) em `public/fonts/` — usada no wordmark "NEWWAY". Sem o arquivo, o site usa Montserrat. Confira a licença da fonte.
- **Montserrat:** carregada automaticamente via `next/font` (hospedada junto com o site).

## 6. Recursos implementados

**Página pública**
- Campos obrigatórios (responsável, empresa, WhatsApp com máscara, e‑mail) e Site/Instagram opcional.
- Aviso com borda amarela, pergunta principal, contador de caracteres e sugestões‑guia.
- Indicador de qualidade (Insuficiente / Básica / Boa / Excelente) — mínimo de **300 caracteres** (validado no navegador, na API e no banco).
- Rascunho automático no `localStorage` (por cliente).
- `?cliente=` salvo em `client_slug`; tela de agradecimento.
- Anti‑spam: honeypot oculto + limite de **5 envios por hora por IP** (persistido no Postgres).

**Painel**
- Login por e‑mail/senha, sessão em cookies **httpOnly** (`@supabase/ssr`), logout.
- Middleware em `/admin/*` + verificação de admin em cada página/rota (defesa em profundidade).
- Lista (tabela no desktop, cards no celular) com busca, filtro por status e paginação.
- Detalhe: resposta completa, **Copiar para prompt da IA** (instrução de sistema pronta para o Gemini), notas internas, troca de status, exportar `.txt`/`.md`.

**Segurança**
- Segredos só em variáveis de ambiente; `server-only` impede importar a service role no front.
- Zod no formulário e nas rotas; texto sanitizado ao salvar e escapado ao exibir (sem `dangerouslySetInnerHTML`); links só `http(s)`.
- Headers: CSP, HSTS, X‑Frame‑Options, X‑Content‑Type‑Options, Referrer‑Policy, Permissions‑Policy; `no-store` no painel e nas APIs.

## 7. Ajustes comuns

- **Mudar o limite de envios:** `RATE_LIMIT_MAX` e `RATE_LIMIT_WINDOW_SECONDS` em `src/lib/rate-limit.ts`.
- **Mudar o texto do prompt do Gemini:** `buildGeminiPrompt` em `src/lib/format.ts`.
- **Mudar os níveis de qualidade:** `src/lib/constants.ts` (`QUALITY_*`, `MIN_ANSWER_LENGTH`). Se alterar o mínimo de 300, ajuste também a constraint `briefings_main_answer_len` no SQL.
