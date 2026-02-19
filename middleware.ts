import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware para proteger rutas y redirigir según el estado de autenticación del usuario
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Si no hay token y la ruta no es pública, envia a login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si hay token y está en login, envia a dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)"],
};
