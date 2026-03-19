import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function checkAdminAuth(): NextResponse | null {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session");
  const secret = process.env.ADMIN_SECRET;

  if (!session || !secret || session.value !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
