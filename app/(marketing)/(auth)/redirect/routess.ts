import { NextResponse, type NextRequest } from "next/server";

import { getSession, roleHome } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const destination = session ? roleHome(session.user.role) : "/sign-in";

  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set("Cache-Control", "no-store");
  return response;
}
