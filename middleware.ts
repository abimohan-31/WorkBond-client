import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/services",
    "/pricelists",
    "/workbond/admin/login",
  ];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access
  const userCookie = request.cookies.get("user")?.value;
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);

      // Admin routes
      if (pathname.startsWith("/admin")) {
        if (user.role !== "admin") {
          const homeUrl = new URL("/", request.url);
          return NextResponse.redirect(homeUrl);
        }
      }

      // Provider routes
      if (pathname.startsWith("/provider")) {
        if (user.role !== "provider") {
          const homeUrl = new URL("/", request.url);
          return NextResponse.redirect(homeUrl);
        }
      }

      // Customer routes
      if (pathname.startsWith("/customer")) {
        if (user.role !== "customer") {
          const homeUrl = new URL("/", request.url);
          return NextResponse.redirect(homeUrl);
        }
      }
    } catch (error) {
      // Invalid user cookie, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
