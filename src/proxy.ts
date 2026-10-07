import { NextResponse, type NextRequest } from "next/server";

/**
 * Language routing. Bangla lives under /bn. English is served at the root: those requests are
 * rewritten internally to /en/..., and /en/... URLs redirect to the unprefixed canonical URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/bn" || pathname.startsWith("/bn/")) return NextResponse.next();

  const url = request.nextUrl.clone();
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals and any path with a file extension (icons, sitemap files, …).
  matcher: ["/((?!api|_next|opengraph-image|.*\\..*).*)"],
};
