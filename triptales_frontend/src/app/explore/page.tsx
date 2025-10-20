"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PostGrid from "@/components/posts/PostGrid";
import PostFilters from "@/components/posts/PostFilters";
import type { Post } from "@/types/post";
import useInfiniteScroll from "@/lib/hooks/useInfiniteScroll";
import useDebounce from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils";

type QueryState = {
  q: string;
  tags: string[];
  locations: string[];
  sort: "recent" | "popular";
  status?: "draft" | "published";
};

const DEFAULT_QUERY: QueryState = {
  q: "",
  tags: [],
  locations: [],
  sort: "recent",
  status: "published",
};

async function fetchPage(page: number, query: QueryState, signal?: AbortSignal) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "12");
  if (query.q) params.set("q", query.q);
  if (query.tags.length) params.set("tags", query.tags.join(","));
  if (query.locations.length) params.set("locations", query.locations.join(","));
  if (query.sort) params.set("sort", query.sort);
  if (query.status) params.set("status", query.status);
  const res = await fetch(`/api/posts?${params.toString()}`, { signal });
  if (!res.ok) {
    return { data: [] as Post[], hasMore: false };
  }
  const json = await res.json();
  return { data: (json.data || []) as Post[], hasMore: !!json.hasMore };
}

export default function ExplorePage() {
  const [query, setQuery] = useState<QueryState>(DEFAULT_QUERY);
  const [items, setItems] = useState<Post[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const debouncedQ = useDebounce(query.q, 350);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Extract dependencies for ESLint
  const tagsKey = query.tags.join(",");
  const locationsKey = query.locations.join(",");
  const sortKey = query.sort;
  const statusKey = query.status;

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      const { data, hasMore } = await fetchPage(1, { ...query, q: debouncedQ }, controller.signal);
      if (!ignore) {
        setItems(data);
        setPage(1);
        setHasMore(hasMore);
      }
      setLoading(false);
    };
    run();

    return () => {
      ignore = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, tagsKey, locationsKey, sortKey, statusKey]);

  useInfiniteScroll({
    target: sentinelRef,
    onIntersect: async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      const next = page + 1;
      const { data, hasMore: more } = await fetchPage(next, { ...query, q: debouncedQ });
      setItems((prev) => (prev ? [...prev, ...data] : data));
      setPage(next);
      setHasMore(more);
      setLoading(false);
    },
    rootMargin: "300px",
    disabled: !hasMore,
  });

  const onFiltersChange = useCallback((next: Partial<QueryState>) => {
    setItems(null);
    setQuery((prev) => ({ ...prev, ...next }));
  }, []);

  const resultInfo = useMemo(() => {
    const parts: string[] = [];
    if (debouncedQ) parts.push(`"${debouncedQ}"`);
    if (query.tags.length) parts.push(`${query.tags.length} tag${query.tags.length > 1 ? 's' : ''}`);
    if (query.locations.length) parts.push(`${query.locations.length} location${query.locations.length > 1 ? 's' : ''}`);
    return parts.length ? parts.join(" • ") : "All posts";
  }, [debouncedQ, query.tags, query.locations]);

  const resultCount = items?.length ?? 0;

  return (
    <main className="app-container section-spacing">
      {/* Hero Header */}
      <header className="mb-8">
        <h1 className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight mb-3",
          "text-gray-900"
        )}>
          Explore Stories
        </h1>
        <p className="text-base text-gray-600">
          Find posts by tags, locations, and keywords. Discover hidden gems and popular destinations.
        </p>
      </header>

      {/* Filters */}
      <section className={cn(
        "mb-8 bg-white rounded-xl shadow-md border border-gray-100/50 p-6"
      )}>
        <PostFilters value={query} onChange={onFiltersChange} />
      </section>

      {/* Results */}
      <section aria-live="polite" aria-busy={loading ? "true" : "false"}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-900">{resultInfo}</p>
            {resultCount > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </p>
            )}
          </div>
          {hasMore && (
            <p className="text-xs text-blue-600 font-medium">
              Scroll for more
            </p>
          )}
        </div>

        {items === null ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <div className={cn(
            "text-center py-16 px-4 bg-white rounded-xl",
            "border border-dashed border-gray-300"
          )}>
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-sm text-gray-600">
              Try adjusting your filters or search terms to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          <PostGrid posts={items} />
        )}

        <div ref={sentinelRef} className="h-10" />
        
        {loading && items && items.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </section>
    </main>
  );
}
