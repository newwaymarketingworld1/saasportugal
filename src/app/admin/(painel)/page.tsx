import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { STATUSES, type Briefing } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getQuality } from "@/lib/quality";
import { sanitizeSearchTerm } from "@/lib/sanitize";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Briefings" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

const LIST_COLUMNS =
  "id, created_at, client_slug, responsible_name, company_name, status, answer_length";

type Row = Pick<
  Briefing,
  | "id"
  | "created_at"
  | "client_slug"
  | "responsible_name"
  | "company_name"
  | "status"
  | "answer_length"
>;

export default async function AdminHome({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;

  const q = sanitizeSearchTerm(typeof sp.q === "string" ? sp.q : "");
  const status = (STATUSES as readonly string[]).includes(sp.status ?? "") ? sp.status! : "";
  const page = Math.max(1, Math.min(1000, parseInt(sp.page ?? "1", 10) || 1));
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let query = supabase
    .from("briefings")
    .select(LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (status) query = query.eq("status", status);
  if (q) {
    const term = `%${q.replace(/[%_]/g, " ")}%`;
    query = query.or(
      `company_name.ilike."${term}",responsible_name.ilike."${term}",client_slug.ilike."${term}"`,
    );
  }

  const { data, count, error } = await query;
  const rows = (data ?? []) as Row[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (overrides: { page?: number; status?: string }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    const st = overrides.status ?? status;
    if (st) p.set("status", st);
    if (overrides.page && overrides.page > 1) p.set("page", String(overrides.page));
    const s = p.toString();
    return `/admin${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-mute">Painel</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Briefings recebidos</h1>
        </div>
        <p className="text-sm text-mute">
          {total} {total === 1 ? "briefing" : "briefings"}
        </p>
      </div>

      {/* Busca + filtro */}
      <form method="get" action="/admin" className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="q" className="label">
            Buscar por empresa
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            type="search"
            maxLength={80}
            placeholder="Digite um nome…"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="status" className="label">
            Status
          </label>
          <select id="status" name="status" defaultValue={status} className="field min-w-[11rem] !pr-8">
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary !py-3.5">
          Filtrar
        </button>
      </form>

      <nav aria-label="Filtro rápido de status" className="mb-10 flex flex-wrap gap-2">
        {[{ value: "", label: "Todos" }, ...STATUSES.map((s) => ({ value: s, label: s }))].map(
          (opt) => (
            <Link
              key={opt.value || "todos"}
              href={href({ status: opt.value, page: 1 })}
              aria-current={status === opt.value ? "page" : undefined}
              className={`border-2 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] transition ${
                status === opt.value
                  ? "border-ink bg-ink text-brand"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              {opt.label}
            </Link>
          ),
        )}
      </nav>

      {error && (
        <p role="alert" className="mb-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
          Não foi possível carregar os briefings. Verifique a configuração do Supabase.
        </p>
      )}

      {rows.length === 0 && !error ? (
        <div className="border-2 border-dashed border-line px-6 py-20 text-center">
          <p className="text-lg font-bold">Nenhum briefing encontrado.</p>
          <p className="mt-2 text-sm text-mute">
            {q || status ? "Tente outra busca ou limpe os filtros." : "Os briefings enviados pelos clientes aparecerão aqui."}
          </p>
        </div>
      ) : (
        <>
          {/* Tabela (telas médias+) */}
          <div className="hidden overflow-hidden border-2 border-ink md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink text-[0.65rem] uppercase tracking-[0.16em] text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 font-bold">Empresa</th>
                  <th scope="col" className="px-5 py-4 font-bold">Responsável</th>
                  <th scope="col" className="px-5 py-4 font-bold">Recebido em</th>
                  <th scope="col" className="px-5 py-4 font-bold">Resposta</th>
                  <th scope="col" className="px-5 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-brand-soft">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/briefings/${r.id}`}
                        className="font-bold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                      >
                        {r.company_name}
                      </Link>
                      {r.client_slug && (
                        <span className="ml-2 text-xs text-mute">#{r.client_slug}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">{r.responsible_name || <span className="text-mute">—</span>}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-mute">{formatDate(r.created_at)}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="tabular-nums">{r.answer_length.toLocaleString("pt-BR")}</span>{" "}
                      <span className="text-xs text-mute">({getQuality(r.answer_length).label})</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (celular) */}
          <ul className="space-y-4 md:hidden">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/briefings/${r.id}`}
                  className="block border-2 border-ink p-5 transition active:bg-brand-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-extrabold leading-tight">{r.company_name}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  {r.responsible_name && <p className="mt-1 text-sm">{r.responsible_name}</p>}
                  <p className="mt-3 text-xs text-mute">
                    {formatDate(r.created_at)} ·{" "}
                    {r.answer_length.toLocaleString("pt-BR")} caracteres ({getQuality(r.answer_length).label})
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav aria-label="Paginação" className="mt-10 flex items-center justify-between">
              {page > 1 ? (
                <Link href={href({ page: page - 1 })} className="btn-ghost">
                  ← Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-mute">
                Página {page} de {totalPages}
              </span>
              {page < totalPages ? (
                <Link href={href({ page: page + 1 })} className="btn-ghost">
                  Próxima →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </>
  );
}
