# Interactions

This folder contains small, self-contained UI components that encapsulate optimistic interaction patterns.

- LikeButton: Optimistically increments/decrements `likedCount` and persists via `PATCH /api/posts/:id`.
- FavoriteToggle: Optimistically toggles a user's marker in `favorites`. If `userId` is omitted, the toggle is local-only.

See `src/lib/client/mutations.ts` for the mutation helpers. Toast notifications are shown on success/error, with rollback on error.
