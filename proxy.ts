import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkBasicAuth } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const ok = checkBasicAuth(
    req.headers.get("authorization"),
    process.env.GUESTBOOK_ADMIN_USER ?? "",
    process.env.GUESTBOOK_ADMIN_PASS ?? "",
  );
  if (!ok) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="guestbook admin"' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/guestbook/admin", "/api/guestbook/admin/:path*"],
};
