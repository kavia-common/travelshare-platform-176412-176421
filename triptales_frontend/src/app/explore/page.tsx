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
  const [items, setItems] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const debouncedQ = useDebounce(query.q, 350);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset on query changes (with debounced search term)
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
  }, [debouncedQ, query.tags.join(","), query.locations.join(","), query.sort, query.status]);

  // Infinite scroll
  useInfiniteScroll({
    target: sentinelRef,
    onIntersect: async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      const next = page + 1;
      const { data, hasMore: more } = await fetchPage(next, { ...query, q: debouncedQ });
      setItems((prev) => [...prev, ...data]);
      setPage(next);
      setHasMore(more);
      setLoading(false);
    },
    rootMargin: "300px",
    disabled: !hasMore,
  });

  const onFiltersChange = useCallback((next: Partial<QueryState>) => {
    setQuery((prev) => ({ ...prev, ...next }));
  }, []);

  const resultInfo = useMemo(() => {
    const parts: string[] = [];
    if (debouncedQ) parts.push(`“${debouncedQ}”`);
    if (query.tags.length) parts.push(`tags: ${query.tags.join(", ")}`);
    if (query.locations.length) parts.push(`locations: ${query.locations.join(", ")}`);
    return parts.length ? parts.join(" • ") : "All posts";
  }, [debouncedQ, query.tags, query.locations]);

  return (
    <main className="app-container py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Explore</h1>
        <p className="text-sm text-gray-600">Find posts by tags, location, and keywords.</p>
      </header>

      <section className="mb-4 card-surface p-4">
        <PostFilters
          value={query}
          onChange={onFiltersChange}
        />
      </section>

      <section aria-live="polite" aria-busy={loading ? "true" : "false"}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">{resultInfo}</p>
          <p className={cn("text-xs", hasMore ? "text-blue-700" : "text-gray-500")}>
            {hasMore ? "Scroll for more" : "End of results"}
          </p>
        </div>
        <PostGrid posts={items} />
        <div ref={sentinelRef} className="h-10" />
        {loading && <div className="mt-4 text-gray-600">Loading…</div>}
      </section>
    </main>
  );
}
