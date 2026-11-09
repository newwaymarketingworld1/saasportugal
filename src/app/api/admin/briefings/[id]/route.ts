import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { briefingUpdateSchema, fieldErrors, uuidSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = briefingUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  // Cliente com a sessão do admin: o RLS garante a autorização no banco.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("briefings")
    .update(parsed.data)
    .eq("id", id)
    .select("id, status, internal_notes")
    .maybeSingle();

  if (error) {
    console.error("[admin] falha ao atualizar briefing:", error);
    return NextResponse.json({ error: "Não foi possível salvar." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Briefing não encontrado." }, { status: 404 });

  return NextResponse.json({ ok: true, briefing: data });
}
