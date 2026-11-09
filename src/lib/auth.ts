import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type AdminSession = { id: string; email: string };

/**
 * Retorna o admin logado ou null. Valida a sessão no servidor do Supabase
 * (getUser) e confirma que o e-mail está na tabela `admins` (via RLS).
 */
export const getAdmin = cache(async (): Promise<AdminSession | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  return data ? { id: user.id, email: user.email } : null;
});

/** Use em páginas/layouts do painel: redireciona ao login se não for admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
