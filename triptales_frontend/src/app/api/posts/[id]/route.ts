import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import PostModel from "@/lib/db/models/Post";
import { postUpdateSchema, formatZodError, safeParseJson } from "@/lib/validation/postSchemas";
import { getSession } from "@/lib/auth/session.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "BadRequest", details: [{ message: "Invalid id format" }] },
        { status: 400 }
      );
    }

    const existing = await PostModel.findById(id).lean().exec();
    if (!existing) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    if (existing.author && String(existing.author) !== String(session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedBody = await safeParseJson(req);
    if (!parsedBody.ok) {
      return NextResponse.json(parsedBody.error, { status: 400 });
    }

    const result = postUpdateSchema.safeParse(parsedBody.data);
    if (!result.success) {
      return NextResponse.json(formatZodError(result.error), { status: 400 });
    }

    const updateData = { ...result.data } as Record<string, unknown>;
    if ("author" in updateData) delete updateData.author;

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!updated) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
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

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "BadRequest", details: [{ message: "Invalid id format" }] },
        { status: 400 }
      );
    }

    const existing = await PostModel.findById(id).lean().exec();
    if (!existing) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    if (existing.author && String(existing.author) !== String(session.userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await PostModel.findByIdAndDelete(id).lean().exec();
    if (!deleted) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "InternalServerError", details: [{ message }] },
      { status: 500 }
    );
  }
}
