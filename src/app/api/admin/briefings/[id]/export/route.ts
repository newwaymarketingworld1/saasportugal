import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import type { Briefing } from "@/lib/constants";
import { buildMarkdown, buildPlainText } from "@/lib/format";
import { toFileSlug } from "@/lib/sanitize";
import { uuidSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const format = new URL(request.url).searchParams.get("format") === "md" ? "md" : "txt";

  const supabase = await createClient();
  const { data } = await supabase.from("briefings").select("*").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Briefing não encontrado." }, { status: 404 });

  const briefing = data as Briefing;
  const body = format === "md" ? buildMarkdown(briefing) : buildPlainText(briefing);
  const filename = `briefing-${toFileSlug(briefing.company_name)}.${format}`;

  return new NextResponse(body, {
    headers: {
      "Content-Type":
        format === "md" ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
