import "server-only";
import { createHash } from "node:crypto";
import { createAdminClient } from "./supabase/admin";

/** Máximo de envios por IP dentro da janela. */
export const RATE_LIMIT_MAX = 5;
/** Janela em segundos (1 hora). */
export const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

export function getClientIp(headers: Headers): string {
  // Na Vercel, x-forwarded-for é definido pela plataforma (não forjável pelo cliente).
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * Verifica e registra uma tentativa de envio.
 * Persistido no Postgres (e não em memória) porque em ambiente serverless
 * cada requisição pode cair em uma instância diferente.
 */
export async function checkRateLimit(
  ip: string,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const supabase = createAdminClient();
  const ipHash = hashIp(ip);
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  const { count, error } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (error) throw error;

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: RATE_LIMIT_WINDOW_SECONDS };
  }

  const { error: insertError } = await supabase
    .from("rate_limits")
    .insert({ ip_hash: ipHash });
  if (insertError) throw insertError;

  // Limpeza oportunista de registros antigos (~2% das requisições).
  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    await supabase.from("rate_limits").delete().lt("created_at", cutoff);
  }

  return { allowed: true, retryAfter: 0 };
}
