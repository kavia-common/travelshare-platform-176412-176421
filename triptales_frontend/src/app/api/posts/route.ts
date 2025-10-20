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

// Ensure this route is always dynamic and not statically prerendered
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/posts
 * Summary: List posts with pagination, filters, and sorting
 * Description:
 * - Returns a paginated list of posts with optional filters and sorting.
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

    // Mongoose SortOrder typing requires "asc" | "desc" | 1 | -1
    const sortSpec: Record<string, 1 | -1> =
      sort === "popular"
        ? { likedCount: -1 as const, createdAt: -1 as const } // popular: most liked, then recent
        : { createdAt: -1 as const }; // recent

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
