import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obter o token do cookie
  const token = request.cookies.get("auth_token")?.value;

  // Verificar se o usuário está acessando a página principal ou outras páginas protegidas
  const isProtectedRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/profile" ||
    request.nextUrl.pathname === "/network"

  // Verificar se o usuário está acessando páginas de autenticação
  const isAuthRoute = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup"

  // Se for uma rota protegida e não tiver token, redirecionar para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se for uma rota de autenticação e já tiver token, redirecionar para home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configurar em quais caminhos o middleware será executado
export const config = {
  matcher: ["/", "/profile", "/network", "/login", "/signup"],
}

