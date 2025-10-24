import { NextResponse } from 'next/server';
import { samplePosts } from '../../../../lib/mockData';

// PUBLIC_INTERFACE
export async function GET(_: Request, { params }: { params: { id: string } }) {
  /** Get a post by id - placeholder using in-memory sample data. */
  const p = samplePosts.find((x) => x.id === params.id) ?? samplePosts[0];
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ post: p });
}
