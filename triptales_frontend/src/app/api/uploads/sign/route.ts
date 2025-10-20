/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createSignedUploadParams, getCloudinaryPublicConfig } from "@/lib/cloudinary";

// Ensure this route is always dynamic and not statically prerendered
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/uploads/sign
 * Summary: Create a signed upload payload for direct uploads to Cloudinary
 * Description:
 *   Validates requested parameters (folder, timestamp) against a simple allowlist/defaults,
 *   then returns a signature and required fields to perform a client-side upload directly to Cloudinary.
 *
 * Request Body (JSON):
 *   {
 *     folder?: "triptales/posts" | "triptales/avatars" | "triptales/tmp",
 *     timestamp?: number,
 *     eager?: string,
 *     public_id?: string,
 *     context?: string,
 *     tags?: string
 *   }
 *
 * Response (200):
 *   {
 *     signature: string,
 *     timestamp: number,
 *     api_key: string,
 *     cloud_name: string,
 *     upload_preset?: string,
 *     params: Record<string, string | number>
 *   }
 *
 * Errors:
 *  - 400 BadRequest for invalid JSON or validation errors
 *  - 500 InternalServerError if Cloudinary env is missing or unexpected error occurs
 */
export async function POST(req: Request) {
  try {
    let body: any = {};
    const text = await req.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json(
          { error: "BadRequest", details: [{ message: "Invalid JSON body" }] },
          { status: 400 }
        );
      }
    }

    // Optional minimal validation on size of strings to avoid abuse
    const sanitizeStr = (v: unknown, max = 256) =>
      typeof v === "string" ? v.slice(0, max) : undefined;

    const folder = sanitizeStr(body.folder, 64);
    const eager = sanitizeStr(body.eager);
    const public_id = sanitizeStr(body.public_id, 128);
    const context = sanitizeStr(body.context);
    const tags = sanitizeStr(body.tags);

    const timestamp =
      typeof body.timestamp === "number" && Number.isFinite(body.timestamp) ? body.timestamp : undefined;

    const result = createSignedUploadParams({
      folder,
      timestamp,
      eager,
      public_id,
      context,
      tags,
    });

    // Return safe payload. Never include api_secret.
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown server error. Check Cloudinary configuration.";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}

// PUBLIC_INTERFACE
export async function GET() {
  /**
   * Returns public Cloudinary configuration for clients that need it.
   * This avoids hardcoding the cloud name into the client bundle.
   */
  try {
    const cfg = getCloudinaryPublicConfig();
    return NextResponse.json(
      { cloud_name: cfg.cloudName, api_key: cfg.apiKey, upload_preset: cfg.uploadPreset },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown server error. Check Cloudinary configuration.";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}
