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

/**
 * GET /api/posts
 * Returns a paginated list of posts with optional filters and sorting.
 * Query params:
 * - page: number (default 1)
 * - limit: number (default 10, max 100)
 * - q: text search on title/content
 * - tags: comma-separated list
 * - locations: comma-separated list
 * - sort: recent | popular
 * - status: draft | published (optional filter)
 *
 * Response:
 * { data, page, limit, total, hasMore }
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
      // Hint: relies on text index on title and content
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

    const sortSpec =
      sort === "popular"
        ? { likedCount: -1, createdAt: -1 } // use likedCount then recency
        : { createdAt: -1 }; // recent

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PostModel.find(filter).sort(sortSpec).skip(skip).limit(limit).lean().exec(),
      PostModel.countDocuments(filter).exec(),
    ]);

    const hasMore = page * limit < total;

    return NextResponse.json({ data, page, limit, total, hasMore }, { status: 200 });
  } catch (err: unknown) {
    // For unexpected errors
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Creates a new post.
 * Body: PostCreateInput
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const parsedBody = await safeParseJson(req);
    if (!parsedBody.ok) {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }

    const result = postCreateSchema.safeParse(parsedBody.data);
    if (!result.success) {
      return NextResponse.json(formatZodError(result.error), { status: 400 });
    }

    const created = await PostModel.create(result.data);

    // lean() does not apply on create; convert to JSON-friendly
    return NextResponse.json(created.toJSON(), { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}
