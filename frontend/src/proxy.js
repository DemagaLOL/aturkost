import { NextResponse } from "next/server";
import { TOKEN_KEY } from "./lib/session";

export function proxy(request) {
  const hasToken = Boolean(request.cookies.get(TOKEN_KEY)?.value);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/items") && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if ((pathname === "/login" || pathname === "/register") && hasToken) {
    return NextResponse.redirect(new URL("/items", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/items/:path*", "/login", "/register"],
};
