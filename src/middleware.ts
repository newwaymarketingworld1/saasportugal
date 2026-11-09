import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { secureCookieOptions } from "@/lib/supabase/cookies";

/**
 * Protege todas as rotas /admin/*.
 * - Sem sessão válida            -> /admin/login
 * - Logado, mas fora da `admins` -> encerra a sessão e volta ao login
 * - Logado e admin em /admin/login -> /admin
 * Também renova o token de sessão (cookies httpOnly) a cada requisição.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    // Sem configuração não há como autenticar: bloqueia o painel.
    return new NextResponse("Configuração do servidor incompleta.", { status: 500 });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, secureCookieOptions(options)),
        );
      },
    },
  });

  /** Redireciona preservando os cookies de sessão que acabaram de ser definidos. */
  const redirectTo = (path: string) => {
    const target = request.nextUrl.clone();
    const [p, query] = path.split("?");
    target.pathname = p;
    target.search = query ? `?${query}` : "";
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return isLoginPage ? response : redirectTo("/admin/login");
  }

  // Usuário autenticado: confirma que está na lista de admins (RLS permite
  // ler apenas a própria linha).
  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", (user.email ?? "").toLowerCase())
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return isLoginPage ? response : redirectTo("/admin/login?erro=acesso");
  }

  if (isLoginPage) return redirectTo("/admin");

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
