/**
 * TypeScript interfaces aligned with the Mongoose Post schema.
 * These are safe to import on both client and server code.
 */

export type PostStatus = "draft" | "published";

export interface PostImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export interface PostTip {
  text: string;
  author?: string;
}

// PUBLIC_INTERFACE
export interface Post {
  /**
   * Title of the post (required)
   */
  title: string;

  /**
   * Markdown or rich text content (optional)
   */
  content?: string;

  /**
   * Images attached to the post
   */
  images?: PostImage[];

  /**
   * Tag labels used for filtering and discovery
   */
  tags?: string[];

  /**
   * Locations associated with the post (city, region, country, etc.)
   */
  locations?: string[];

  /**
   * User-submitted travel tips
   */
  tips?: PostTip[];

  /**
   * Author identifier (user id string)
   */
  author?: string;

  /**
   * Count of likes for the post
   */
  likedCount?: number;

  /**
   * List of user IDs who favorited this post (placeholder for future)
   */
  favorites?: string[];

  /**
   * Publication status
   */
  status?: PostStatus;

  /**
   * Automatic timestamps (present when coming from DB)
   */
  createdAt?: string | Date;
  updatedAt?: string | Date;

  /**
   * Optional database identifier when mapped from MongoDB
   */
  _id?: string;
}
