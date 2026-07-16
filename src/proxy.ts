import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { isRateLimited } from "@/lib/rate-limit";

function clientIp(request: NextRequest): string {
  // Coolify's Traefik proxy sits in front of us, so the real client IP is
  // here, not on the socket. First value is the original client.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

// Only routes that are either brute-force targets (login) or cost external
// quota (Google Calendar API on book/availability) get limited.
const RATE_LIMITS: {
  path: string;
  method?: string;
  limit: number;
  windowMs: number;
}[] = [
  { path: "/admin/login", method: "POST", limit: 5, windowMs: 5 * 60_000 },
  { path: "/api/book", limit: 10, windowMs: 60_000 },
  { path: "/api/availability", limit: 30, windowMs: 60_000 },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rule = RATE_LIMITS.find(
    (r) => r.path === pathname && (!r.method || r.method === request.method)
  );
  if (rule) {
    const key = `${clientIp(request)}:${rule.path}`;
    if (isRateLimited(key, rule.limit, rule.windowMs)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Probá de nuevo en unos minutos." },
        { status: 429 }
      );
    }
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/book", "/api/availability"],
};
