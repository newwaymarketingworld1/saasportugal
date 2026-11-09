import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com a SERVICE ROLE KEY — ignora o RLS.
 * Use SOMENTE em rotas de API/servidor e nunca importe em componentes de
 * cliente (o "server-only" faz o build falhar caso isso aconteça).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
