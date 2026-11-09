-- =============================================================================
-- NewWay Marketing World — Sistema de Briefing
-- Schema do banco (Supabase / Postgres) + políticas RLS
--
-- Como usar: Supabase > SQL Editor > New query > cole este arquivo > Run.
-- O script é idempotente: pode ser executado mais de uma vez.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) Tabela de administradores (lista de e-mails autorizados a usar o painel)
--    Os usuários em si são criados em Authentication > Users (manualmente).
--    Aqui apenas dizemos QUAIS e-mails têm permissão.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now(),
  constraint admins_email_lowercase check (email = lower(email))
);

-- ---------------------------------------------------------------------------
-- 2) Tabela de briefings
-- ---------------------------------------------------------------------------
create table if not exists public.briefings (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  client_slug      text,
  responsible_name text not null,
  company_name     text not null,
  whatsapp         text not null,
  email            text not null,
  website          text,
  main_answer      text not null,
  status           text not null default 'novo',
  internal_notes   text not null default '',
  -- Tamanho da resposta (calculado pelo banco, útil para listar/ordenar).
  answer_length    integer generated always as (char_length(main_answer)) stored,

  constraint briefings_status_check
    check (status in ('novo', 'em análise', 'concluído')),
  constraint briefings_client_slug_check
    check (client_slug is null or client_slug ~ '^[a-z0-9][a-z0-9_-]{0,59}$'),
  constraint briefings_main_answer_len
    check (char_length(main_answer) between 300 and 20000),
  constraint briefings_internal_notes_len
    check (char_length(internal_notes) <= 10000)
);

create index if not exists briefings_created_at_idx on public.briefings (created_at desc);
create index if not exists briefings_status_idx     on public.briefings (status);
create index if not exists briefings_client_slug_idx on public.briefings (client_slug);

-- ---------------------------------------------------------------------------
-- 3) Controle de tentativas de envio (rate limit por IP)
--    Guardamos apenas um HASH do IP (nunca o IP em texto puro).
--    Acessada somente pela rota de API, com a service role key.
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  id         bigint generated always as identity primary key,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limits_lookup_idx
  on public.rate_limits (ip_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- 4) Função auxiliar: o usuário logado é um admin autorizado?
--    SECURITY DEFINER para poder consultar public.admins sem depender das
--    políticas da própria tabela (evita recursão de RLS).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 5) Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admins      enable row level security;
alter table public.briefings   enable row level security;
alter table public.rate_limits enable row level security;

-- Garante que os papéis públicos (anon/authenticated) não tenham privilégios
-- além dos necessários. A service role ignora RLS e é usada só no servidor.
revoke all on public.admins      from anon, authenticated;
revoke all on public.briefings   from anon, authenticated;
revoke all on public.rate_limits from anon, authenticated;

-- Admins autenticados: leem e atualizam briefings (não inserem, não apagam).
-- O INSERT do público é feito exclusivamente pela rota /api/briefing, no
-- servidor, com a service role key — por isso NÃO existe política de INSERT
-- (nem de SELECT) para o papel "anon". Ou seja: o público nunca lê nada.
grant select on public.briefings to authenticated;
grant update (status, internal_notes) on public.briefings to authenticated;

-- Cada usuário logado pode ver apenas a própria linha em admins
-- (usado pelo middleware para confirmar a autorização).
grant select on public.admins to authenticated;

drop policy if exists "admins_select_own" on public.admins;
create policy "admins_select_own"
  on public.admins
  for select
  to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "briefings_select_admin" on public.briefings;
create policy "briefings_select_admin"
  on public.briefings
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "briefings_update_admin" on public.briefings;
create policy "briefings_update_admin"
  on public.briefings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- rate_limits: RLS ligada e SEM políticas = ninguém (anon/authenticated)
-- consegue ler ou escrever. Só a service role (servidor) acessa.

-- ---------------------------------------------------------------------------
-- 6) Primeiro admin
--    1. Crie o usuário em Authentication > Users > Add user (e-mail + senha,
--       marque "Auto Confirm User").
--    2. Descomente e rode o comando abaixo com o MESMO e-mail (em minúsculas):
-- ---------------------------------------------------------------------------
-- insert into public.admins (email) values ('voce@suaagencia.com.br')
-- on conflict (email) do nothing;
