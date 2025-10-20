import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import UserModel from "@/lib/db/models/User";
import { loginSchema, formatZodError, safeParseJson } from "@/lib/validation/authSchemas";
import { setSessionCookie } from "@/lib/auth/session-impl.server";
import bcrypt from "bcryptjs";

// Ensure always dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/auth/login
 * Summary: Log in an existing user
 * Description:
 *  - Validates email and password
 *  - Verifies hashed password with bcrypt
 *  - Sets session JWT in HttpOnly cookie (7 days)
 *
 * Request Body:
 *  { email: string, password: string }
 *
 * Responses:
 *  - 200 OK: { id, email, name }
 *  - 400 ValidationError
 *  - 401 Unauthorized (invalid credentials)
 *  - 500 InternalServerError
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const parsed = await safeParseJson(req);
    if (!parsed.ok) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const result = loginSchema.safeParse(parsed.data);
    if (!result.success) {
      return NextResponse.json(formatZodError(result.error), { status: 400 });
    }

    const email = result.data.email.toLowerCase().trim();
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", details: [{ message: "Invalid email or password" }] },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(result.data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Unauthorized", details: [{ message: "Invalid email or password" }] },
        { status: 401 }
      );
    }

    await setSessionCookie({ id: String(user._id), email: user.email });

    return NextResponse.json(
      { id: String(user._id), email: user.email, name: user.name },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isConfig = message.toLowerCase().includes("auth_secret");
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message: isConfig ? "Server auth configuration error" : message }] },
      { status: 500 }
    );
  }
}
