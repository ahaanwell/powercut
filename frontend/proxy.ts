import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirects the bare apex domain to the canonical www subdomain in
// production, so search engines never see the same content under two
// different hostnames. Only triggers on an exact match for the real apex
// host, so it's a no-op in local dev and on preview deployments.
const APEX_HOST = "powercut.info";
const CANONICAL_HOST = "www.powercut.info";

// Per-state sitemap files (e.g. /sitemap-maharashtra.xml) are served by a
// single dynamic route, since Next.js route segments can't mix a literal
// ".xml" suffix with a dynamic slug in one path segment.
const SITEMAP_PATTERN = /^\/sitemap-([a-z0-9-]+)\.xml$/;
const RESERVED_SITEMAP_SLUGS = new Set(["static", "content"]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === APEX_HOST) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  const sitemapMatch = request.nextUrl.pathname.match(SITEMAP_PATTERN);
  if (sitemapMatch && !RESERVED_SITEMAP_SLUGS.has(sitemapMatch[1])) {
    const url = request.nextUrl.clone();
    url.pathname = `/sitemap-state/${sitemapMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
