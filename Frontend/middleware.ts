import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")
  const path = request.nextUrl.pathname

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/patiens", "/clients", "/appointments"]

  // // Verificar si la ruta actual es una ruta pública
  // const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // // Si la ruta es pública, permitir acceso
  // if (isPublicRoute) {
  //   // Si ya está autenticado y trata de acceder a login o register, redirigir a dashboard
  //   if (token && (path === "/login" || path === "/register")) {
  //     return NextResponse.redirect(new URL("/", request.url))
  //   }
  //   return NextResponse.next()
  // }

  // // Si no hay token y la ruta no es pública, redirigir a login
  // if (!token) {
  //   const loginUrl = new URL("/login", request.url)
  //   // Preservar la URL original como parámetro de consulta para redirigir después del login
  //   loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.nextUrl.pathname))
  //   return NextResponse.redirect(loginUrl)
  // }

  // return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
