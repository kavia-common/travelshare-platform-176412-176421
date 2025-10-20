import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import PostModel from "@/lib/db/models/Post";
import { postUpdateSchema, formatZodError, safeParseJson } from "@/lib/validation/postSchemas";

/**
 * GET /api/posts/:id
 * Returns a single post by id (404 if not found).
 *
 * Next.js Route Handler signature:
 *   GET(request: Request, context: { params: Promise<{ id: string }> })
 */
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "BadRequest", details: [{ message: "Invalid id format" }] },
        { status: 400 }
      );
    }

    const doc = await PostModel.findById(id).lean().exec();
    if (!doc) {
      return NextResponse.json(
        { error: "NotFound", details: [{ message: "Post not found" }] },
        { status: 404 }
      );
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/posts/:id
 * Partially updates a post. Body must include at least one updatable field.
 */
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "BadRequest", details: [{ message: "Invalid id format" }] },
        { status: 400 }
      );
    }

    const parsedBody = await safeParseJson(req);
    if (!parsedBody.ok) {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }

    const result = postUpdateSchema.safeParse(parsedBody.data);
    if (!result.success) {
      return NextResponse.json(formatZodError(result.error), { status: 400 });
    }

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $set: result.data },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!updated) {
      return NextResponse.json(
        { error: "NotFound", details: [{ message: "Post not found" }] },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/:id
 * Deletes a post. Returns 204 No Content on success (or 200 with a message).
 */
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "BadRequest", details: [{ message: "Invalid id format" }] },
        { status: 400 }
      );
    }

    const deleted = await PostModel.findByIdAndDelete(id).lean().exec();
    if (!deleted) {
      return NextResponse.json(
        { error: "NotFound", details: [{ message: "Post not found" }] },
        { status: 404 }
      );
    }

    // Using 204 No Content to signal deletion success without payload
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}
