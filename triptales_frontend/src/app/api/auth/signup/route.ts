import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import UserModel from "@/lib/db/models/User";
import { signupSchema, formatZodError, safeParseJson } from "@/lib/validation/authSchemas";
import { setSessionCookie } from "@/lib/auth/session";
import bcrypt from "bcryptjs";

// Ensure always dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/auth/signup
 * Summary: Create a new user account
 * Description:
 *  - Validates email, password, name via zod
 *  - Hashes password with bcrypt
 *  - Stores user in MongoDB (unique email)
 *  - Sets session JWT in HttpOnly cookie (7 days)
 *
 * Request Body:
 *  { email: string, password: string, name: string }
 *
 * Responses:
 *  - 201 Created: { id, email, name }
 *  - 400 ValidationError
 *  - 409 Conflict (duplicate email)
 *  - 500 InternalServerError
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const parsed = await safeParseJson(req);
    if (!parsed.ok) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const result = signupSchema.safeParse(parsed.data);
    if (!result.success) {
      return NextResponse.json(formatZodError(result.error), { status: 400 });
    }

    const email = result.data.email.toLowerCase().trim();

    // Duplicate email check
    const existing = await UserModel.findOne({ email }).lean().exec();
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", details: [{ path: "email", message: "Email already registered" }] },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(result.data.password, 12);
    const created = await UserModel.create({
      email,
      name: result.data.name.trim(),
      passwordHash,
    });

    // Set session cookie
    await setSessionCookie({ id: String(created._id), email: created.email });

    return NextResponse.json(
      { id: String(created._id), email: created.email, name: created.name },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // If AUTH_SECRET missing, surface as 500 with hint
    const isConfig = message.toLowerCase().includes("auth_secret");
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message: isConfig ? "Server auth configuration error" : message }] },
      { status: 500 }
    );
  }
}
