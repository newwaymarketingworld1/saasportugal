"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

/**
 * Login por e-mail e senha, executado no servidor: a sessão é gravada em
 * cookies httpOnly (o JavaScript do navegador nunca vê o token).
 */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    // Mensagem genérica de propósito (não revela se o e-mail existe).
    return { error: "E-mail ou senha incorretos." };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", (data.user.email ?? "").toLowerCase())
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Este usuário não tem permissão para acessar o painel." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
