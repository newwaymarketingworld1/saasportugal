import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";
import { secureCookieOptions } from "./cookies";

/**
 * Cliente Supabase do servidor, autenticado com a sessão do usuário (cookies).
 * Respeita o RLS: só enxerga o que o usuário logado tem permissão de ver.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, secureCookieOptions(options)),
          );
        } catch {
          // Chamado a partir de um Server Component (somente leitura).
          // O middleware já renova a sessão, então é seguro ignorar.
        }
      },
    },
  });
}
