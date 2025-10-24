import { NextResponse } from 'next/server';

// PUBLIC_INTERFACE
export async function POST(_: Request, { params }: { params: { id: string } }) {
  /** Placeholder favorite endpoint that always succeeds for optimistic UI. */
  return NextResponse.json({ ok: true, id: params.id });
}
