import { Brand } from "@/components/Brand";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand tone="light" href="/admin" />
          <div className="flex items-center gap-4">
            <span className="hidden max-w-[16rem] truncate text-xs text-white/60 sm:block">
              {admin.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border border-white/40 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] transition hover:border-brand hover:bg-brand hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <div className="h-1 bg-brand" />
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>
    </div>
  );
}
