"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type QueryState = {
  q: string;
  tags: string[];
  locations: string[];
  sort: "recent" | "popular";
  status?: "draft" | "published";
};

const PRESET_TAGS = ["Beaches", "Mountains", "City", "Food", "Nightlife", "Nature"];
const PRESET_LOCATIONS = ["Tokyo", "Paris", "Bali", "New York", "Iceland", "Kyoto"];

// PUBLIC_INTERFACE
export default function PostFilters({
  value,
  onChange,
}: {
  value: QueryState;
  onChange: (next: Partial<QueryState>) => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const addTag = (t: string) => {
    const tag = t.trim();
    if (!tag) return;
    if (value.tags.includes(tag)) return;
    onChange({ tags: [...value.tags, tag] });
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    onChange({ tags: value.tags.filter((x) => x !== tag) });
  };

  const addLocation = (l: string) => {
    const loc = l.trim();
    if (!loc) return;
    if (value.locations.includes(loc)) return;
    onChange({ locations: [...value.locations, loc] });
    setLocationInput("");
  };

  const removeLocation = (loc: string) => {
    onChange({ locations: value.locations.filter((x) => x !== loc) });
  };

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-900 mb-2">
            Search
          </label>
          <Input
            id="search"
            value={value.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search posts..."
            aria-label="Search posts"
          />
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-900 mb-2">
            Sort by
          </label>
          <Select
            id="sort"
            value={value.sort}
            onChange={(e) => onChange({ sort: e.target.value as "recent" | "popular" })}
            aria-label="Sort results"
          >
            <option value="recent">Most recent</option>
            <option value="popular">Most popular</option>
          </Select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
            Status
          </label>
          <Select
            id="status"
            value={value.status || "published"}
            onChange={(e) =>
              onChange({ status: (e.target.value || undefined) as "draft" | "published" | undefined })
            }
            aria-label="Filter by status"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>
      </div>

      {/* Tags and Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tags */}
        <div>
          <label htmlFor="tag-input" className="block text-sm font-medium text-gray-900 mb-2">
            Tags
          </label>
          <div className="flex gap-2">
            <Input
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              aria-label="Add tag"
            />
            <Button type="button" onClick={() => addTag(tagInput)} size="md">
              Add
            </Button>
          </div>

          {/* Active Tags */}
          {value.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {value.tags.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "chip bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  )}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    aria-label={`Remove tag ${t}`}
                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Preset Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTag(t)}
                disabled={value.tags.includes(t)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-medium transition-all",
                  value.tags.includes(t)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <label htmlFor="location-input" className="block text-sm font-medium text-gray-900 mb-2">
            Locations
          </label>
          <div className="flex gap-2">
            <Input
              id="location-input"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Add location..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLocation(locationInput);
                }
              }}
              aria-label="Add location"
            />
            <Button type="button" onClick={() => addLocation(locationInput)} size="md">
              Add
            </Button>
          </div>

          {/* Active Locations */}
          {value.locations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {value.locations.map((l) => (
                <span
                  key={l}
                  className={cn(
                    "chip bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  )}
                >
                  {l}
                  <button
                    type="button"
                    onClick={() => removeLocation(l)}
                    aria-label={`Remove location ${l}`}
                    className="hover:bg-amber-100 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Preset Locations */}
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET_LOCATIONS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => addLocation(l)}
                disabled={value.locations.includes(l)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full font-medium transition-all",
                  value.locations.includes(l)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
