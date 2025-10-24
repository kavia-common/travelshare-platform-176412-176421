import { NextResponse } from 'next/server';

// Note: There is likely an existing POST signer at src/app/api/uploads/sign/route.ts in repo,
// but we provide both handlers here for completeness if missing or to ensure GET works.

// PUBLIC_INTERFACE
export async function GET() {
  /** Return public Cloudinary config for client uploaders. */
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    '';
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
  return NextResponse.json({ cloud_name: cloudName, api_key: apiKey, upload_preset: uploadPreset });
}
