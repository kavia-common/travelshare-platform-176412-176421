import { NextResponse } from 'next/server';
import { samplePosts } from '../../../lib/mockData';

// PUBLIC_INTERFACE
export async function GET() {
  /** List posts - placeholder using in-memory sample data. */
  return NextResponse.json({ posts: samplePosts });
}

// PUBLIC_INTERFACE
export async function POST(request: Request) {
  /** Create a post - placeholder that echoes payload and returns a temp id. */
  const payload = await request.json().catch(() => ({}));
  const id = 'temp_' + Date.now();
  return NextResponse.json({ id, ...payload }, { status: 201 });
}
