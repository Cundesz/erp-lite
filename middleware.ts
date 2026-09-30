import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verificarToken } from "@/lib/session";

const PAGINAS_PROTEGIDAS = ["/", "/clientes", "/produtos", "/pedidos"];

async function temSessaoValida(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return (await verificarToken(token)) !== null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas de auth e arquivos estáticos sempre liberados
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const logado = await temSessaoValida(request);

  // APIs (exceto auth): sem sessão => 401
  if (pathname.startsWith("/api/")) {
    if (!logado) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    return NextResponse.next();
  }

  // Página de login: se já logado, manda pro dashboard
  if (pathname === "/login") {
    if (logado) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // Páginas do ERP: sem sessão => vai pro login
  if (PAGINAS_PROTEGIDAS.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)))) {
    if (!logado) return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
