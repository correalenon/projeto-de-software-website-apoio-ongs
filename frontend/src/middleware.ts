import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obter o token do cookie
  const token = request.cookies.get("token")?.value;
  console.log("Token:", token);

  // Verificar se o usuário está acessando a página principal ou outras páginas protegidas
  const isProtectedRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/ongs" ||
    request.nextUrl.pathname === "/projects"

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
  matcher: ["/", "/ongs", "/projects"],
}
