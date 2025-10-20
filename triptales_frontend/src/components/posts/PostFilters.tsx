"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getFocusRing } from "@/lib/theme";
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
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input
            value={value.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search posts"
            aria-label="Search posts"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
          <Select
            value={value.sort}
            onChange={(e) => onChange({ sort: e.target.value as "recent" | "popular" })}
            aria-label="Sort results"
          >
            <option value="recent">Most recent</option>
            <option value="popular">Most popular</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              aria-label="Add tag"
            />
            <button
              type="button"
              className={cn(
                "text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105",
                getFocusRing()
              )}
              onClick={() => addTag(tagInput)}
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {value.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-blue-200">
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  aria-label={`Remove tag ${t}`}
                  className="ml-1 rounded-full px-1 hover:bg-blue-100"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTag(t)}
                className="text-xs rounded-full bg-gray-100 px-2 py-1 hover:bg-gray-200"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
          <div className="flex gap-2">
            <Input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Add location and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLocation(locationInput);
                }
              }}
              aria-label="Add location"
            />
            <button
              type="button"
              className={cn(
                "text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm hover:brightness-105",
                getFocusRing()
              )}
              onClick={() => addLocation(locationInput)}
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {value.locations.map((l) => (
              <span key={l} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-200">
                {l}
                <button
                  type="button"
                  onClick={() => removeLocation(l)}
                  aria-label={`Remove location ${l}`}
                  className="ml-1 rounded-full px-1 hover:bg-amber-100"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_LOCATIONS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => addLocation(l)}
                className="text-xs rounded-full bg-gray-100 px-2 py-1 hover:bg-gray-200"
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
