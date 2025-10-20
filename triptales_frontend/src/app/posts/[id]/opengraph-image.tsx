import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import type { Post } from "@/types/post";

export const runtime = "edge";
export const alt = "TripTales Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Helper to fetch post data (server-side)
async function fetchPost(id: string, baseUrl: string): Promise<Post | null> {
  const res = await fetch(`${baseUrl}/api/posts/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return (await res.json()) as Post;
}

// PUBLIC_INTERFACE
export default async function handler(request: NextRequest, { params }: { params: { id: string } }) {
  /**
   * Generates an Open Graph image for a post using @vercel/og ImageResponse.
   * Falls back gracefully if post not found.
   */
  const { id } = params;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    request.nextUrl.origin;

  const post = await fetchPost(id, baseUrl);

  const title =
    (post?.title?.slice(0, 120) || "TripTales Post").replace(/\s+/g, " ");
  const subtitle =
    (post?.locations?.join(" • ") || post?.tags?.slice(0, 3).join(" #") || "Travel • Photos • Tips").slice(0, 80);

  // Simple OG card styling
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1220",
          padding: "48px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2563EB",
              boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.98 }}>TripTales</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div>Share your journeys</div>
          <div>triptales.app</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
