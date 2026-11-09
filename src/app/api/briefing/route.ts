import { NextResponse } from "next/server";
import { briefingSchema, fieldErrors } from "@/lib/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 100_000;

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // chamadas não-browser (curl etc.) ainda passam por todo o resto
  try {
    const originHost = new URL(origin).host;
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host && originHost === host) return true;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    return !!site && originHost === new URL(site).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Conteúdo muito grande." }, { status: 413 });
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Conteúdo muito grande." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: humanos nunca enxergam este campo. Se veio preenchido, é robô.
  // Respondemos "sucesso" para não dar pistas, mas não gravamos nada.
  const honeypot = (body as Record<string, unknown>).hp_contact;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = briefingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Verifique os campos destacados.", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const limit = await checkRateLimit(getClientIp(request.headers));
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Muitos envios em pouco tempo. Tente novamente mais tarde." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();
    const { error } = await supabase.from("briefings").insert({
      client_slug: data.client_slug,
      company_name: data.company_name,
      // O formulário só pede o nome da empresa; as colunas abaixo continuam
      // existindo na tabela (NOT NULL), então gravamos vazio.
      responsible_name: "",
      whatsapp: "",
      email: "",
      website: null,
      main_answer: data.main_answer,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[briefing] falha ao salvar:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }
}
