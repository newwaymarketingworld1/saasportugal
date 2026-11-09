import type { CookieOptions } from "@supabase/ssr";

/**
 * Opções aplicadas a TODOS os cookies de sessão do Supabase:
 * httpOnly (JavaScript do navegador não consegue ler), Secure em produção e
 * SameSite=Lax (proteção contra CSRF).
 */
export function secureCookieOptions(options?: CookieOptions): CookieOptions {
  return {
    ...options,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}
