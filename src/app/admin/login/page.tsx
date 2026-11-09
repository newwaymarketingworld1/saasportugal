import type { Metadata } from "next";
import { Brand } from "@/components/Brand";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

type Props = { searchParams: Promise<{ erro?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { erro } = await searchParams;
  return (
    <main className="flex min-h-screen flex-col bg-ink text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="mb-14">
          <Brand tone="light" href="/admin/login" size="lg" />
        </div>
        <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand">
          Área restrita
        </p>
        <h1 className="mb-10 text-3xl font-extrabold">Painel de briefings</h1>
        {erro === "acesso" && (
          <p role="alert" className="mb-6 border border-brand px-4 py-3 text-sm text-brand">
            Este usuário não tem permissão para acessar o painel.
          </p>
        )}
        <LoginForm />
      </div>
      <div className="h-1.5 bg-brand" />
    </main>
  );
}
