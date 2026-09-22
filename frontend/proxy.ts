import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirects the bare apex domain to the canonical www subdomain in
// production, so search engines never see the same content under two
// different hostnames. Only triggers on an exact match for the real apex
// host, so it's a no-op in local dev and on preview deployments.
const APEX_HOST = "powercut.info";
const CANONICAL_HOST = "www.powercut.info";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === APEX_HOST) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
