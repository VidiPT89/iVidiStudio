import { NextResponse, type NextRequest } from "next/server";
import { checkBasicAuth } from "@/lib/auth";

// Everything is behind the login, static chunks included (they carry the building data).
// Only the Client Portal webhook stays open: it is protected by its HMAC signature.
export function proxy(request: NextRequest) {
  const result = checkBasicAuth(
    request.headers.get("authorization"),
    process.env.DASHBOARD_USER,
    process.env.DASHBOARD_PASSWORD,
  );
  if (result === "ok") return NextResponse.next();
  if (result === "not-configured" && process.env.NODE_ENV !== "production") return NextResponse.next();
  if (result === "not-configured") return new NextResponse("Dashboard login not configured.", { status: 503 });
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="iVidi Studio HQ", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!api/portal).*)"],
};
