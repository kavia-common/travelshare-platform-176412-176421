import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import PostModel from "@/lib/db/models/Post";
import {
  listQuerySchema,
  postCreateSchema,
  formatZodError,
  parseQueryParams,
  safeParseJson,
} from "@/lib/validation/postSchemas";
import { getSession } from "@/lib/auth/session-impl.server";

// Ensure this route is always dynamic and not statically prerendered
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/posts
 * Summary: List posts with pagination, filters, and sorting
 */
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const qp = parseQueryParams(url.searchParams);

    const parsed = listQuerySchema.safeParse(qp);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }
    const { page, limit, q, tags, locations, sort, status } = parsed.data;

    const filter: Record<string, unknown> = {};
    if (q && q.trim().length > 0) {
      filter.$text = { $search: q.trim() };
    }
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }
    if (locations && locations.length > 0) {
      filter.locations = { $in: locations };
    }
    if (status) {
      filter.status = status;
    }

    const sortSpec: Record<string, 1 | -1> =
      sort === "popular"
        ? { likedCount: -1 as const, createdAt: -1 as const }
        : { createdAt: -1 as const };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PostModel.find(filter).sort(sortSpec).skip(skip).limit(limit).lean().exec(),
      PostModel.countDocuments(filter).exec(),
    ]);

    const hasMore = page * limit < total;

    return NextResponse.json({ data, page, limit, total, hasMore }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Creates a new post. Requires authentication; sets author to current user.
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedBody = await safeParseJson(req);
    if (!parsedBody.ok) {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }

    const result = postCreateSchema.safeParse(parsedBody.data);
    if (!result.success) {
      return NextResponse.json(formatZodError(result.error), { status: 400 });
    }

    // Disallow client-provided author; enforce server-side
    const input = { ...result.data, author: String(session.userId) } as Record<string, unknown>;
    // Extra safety: ensure authorId not accepted from client payloads (if present)
    if ("authorId" in input) {
      delete (input as { authorId?: unknown }).authorId;
    }

    const created = await PostModel.create(input);

    return NextResponse.json(created.toJSON(), { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}
