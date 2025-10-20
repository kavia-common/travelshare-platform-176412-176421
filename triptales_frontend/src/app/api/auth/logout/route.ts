import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session-impl.server";

/**
 * PUBLIC_INTERFACE
 * POST /api/auth/logout - Clears session cookie.
 * Returns: { ok: true }
 */
export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
