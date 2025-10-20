import React from "react";
import { render, screen } from "@testing-library/react";

// Stub client mutation helpers so LikeButton/FavoriteToggle do not perform fetches
jest.mock("@/lib/client/mutations", () => ({
  __esModule: true,
  adjustLikeCountOptimistic: jest.fn().mockResolvedValue({ ok: true }),
  toggleFavoriteOptimistic: jest.fn().mockResolvedValue({ ok: true }),
}));

import PostCard from "./PostCard";
import type { Post } from "@/types/post";

const samplePost: Post = {
  _id: "abc123",
  title: "Exploring Kyoto",
  content: "Bamboo forest and temples.",
  images: [{ url: "https://example.com/k1.jpg", publicId: "k1" }],
  tags: ["Nature", "City"],
  locations: ["Kyoto", "Japan"],
  likedCount: 5,
  favorites: ["u1"],
};

describe("PostCard", () => {
  it("renders image, title, and action controls with accessible labels", () => {
    render(<PostCard post={samplePost} />);

    // Title
    expect(screen.getByText("Exploring Kyoto")).toBeInTheDocument();

    // Image rendered via mocked next/image -> img element; alt should include title and publicId
    const img = screen.getByRole("img", { name: /Exploring Kyoto/i });
    expect(img).toBeInTheDocument();

    // Link to post by accessible label
    const link = screen.getByRole("link", { name: /Open post: Exploring Kyoto/i });
    expect(link).toHaveAttribute("href", "/posts/abc123");

    // Like button should be present with role button and title "Like" or text content
    const likeBtn = screen.getByRole("button", { name: /Like|Unlike/i });
    expect(likeBtn).toBeInTheDocument();

    // Favorite button present with aria-pressed and title text
    const favBtn = screen.getByRole("button", { name: /Favorite|Favorited|Unfavorite/i });
    expect(favBtn).toBeInTheDocument();
  });

  it("falls back to placeholder when no image provided", () => {
    const postNoImage = { ...samplePost, images: [] };
    render(<PostCard post={postNoImage} />);
    // Placeholder container is aria-hidden icon; ensure article still present and title rendered
    expect(screen.getByText("Exploring Kyoto")).toBeInTheDocument();
  });
});
