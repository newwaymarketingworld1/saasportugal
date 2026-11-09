import Link from "next/link";
import { Brand } from "@/components/Brand";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-6 text-center text-white">
      <Brand tone="light" />
      <p className="text-6xl font-extrabold text-brand">404</p>
      <p className="text-white/70">Página não encontrada.</p>
      <Link href="/briefing" className="btn-primary">
        Ir para o briefing
      </Link>
    </main>
  );
}
