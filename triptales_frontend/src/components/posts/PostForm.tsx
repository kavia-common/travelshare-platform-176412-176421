"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/uploads/ImageUploader";
import TagChips from "./TagChips";
import LocationChip from "./LocationChip";
import type { Post, PostImage, PostTip } from "@/types/post";

// PUBLIC_INTERFACE
export default function PostForm({
  initialValue,
  onSubmit,
}: {
  initialValue?: Post;
  onSubmit: (data: Post) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [content, setContent] = useState(initialValue?.content || "");
  const [tags, setTags] = useState<string[]>(initialValue?.tags || []);
  const [locations, setLocations] = useState<string[]>(initialValue?.locations || []);
  const [tips, setTips] = useState<PostTip[]>(initialValue?.tips || []);
  const [images, setImages] = useState<PostImage[]>(initialValue?.images || []);
  const [status, setStatus] = useState<"draft" | "published">(initialValue?.status || "published");
  const [author, setAuthor] = useState(initialValue?.author || "");
  const [submitting, setSubmitting] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [locInput, setLocInput] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [tipAuthorInput, setTipAuthorInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const addLoc = () => {
    const l = locInput.trim();
    if (l && !locations.includes(l)) setLocations([...locations, l]);
    setLocInput("");
  };
  const removeLoc = (l: string) => setLocations(locations.filter((x) => x !== l));

  const addTip = () => {
    const text = tipInput.trim();
    if (!text) return;
    setTips([...tips, { text, author: tipAuthorInput.trim() || undefined }]);
    setTipInput("");
    setTipAuthorInput("");
  };
  const removeTip = (idx: number) => {
    setTips((prev) => prev.filter((_, i) => i !== idx));
  };

  const onImagesChange = (assets: Array<{ url: string; secure_url: string; public_id: string; width?: number; height?: number }>) => {
    const mapped: PostImage[] = assets.map((a) => ({
      url: a.secure_url || a.url,
      publicId: a.public_id,
      width: a.width,
      height: a.height,
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        _id: initialValue?._id,
        title: title.trim(),
        content,
        images,
        tags,
        locations,
        tips,
        author: author || undefined,
        status,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Basic Information */}
      <section className={cn(
        "bg-white rounded-xl shadow-md border border-gray-100/50 p-6 space-y-5"
      )}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="A day in Kyoto's bamboo forest"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Write your travel story..."
            className={cn(
              "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900",
              "placeholder:text-gray-400 hover:border-gray-400",
              "focus:border-[color:var(--color-primary)] focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(37,99,235,0.6)]",
              "transition-colors resize-y"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Images
          </label>
          <ImageUploader onChange={onImagesChange} />
          {images.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <li key={img.publicId} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.url} 
                    alt={`Image ${idx + 1}`} 
                    className={cn(
                      "h-32 w-full object-cover rounded-lg border border-gray-200",
                      "group-hover:opacity-90 transition-opacity"
                    )} 
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className={cn(
                      "absolute top-2 right-2 text-xs rounded-md",
                      "bg-white/95 px-2 py-1 hover:bg-white shadow-md",
                      "opacity-0 group-hover:opacity-100 transition-opacity"
                    )}
                    aria-label="Remove image"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Metadata */}
      <section className={cn(
        "bg-white rounded-xl shadow-md border border-gray-100/50 p-6 space-y-5"
      )}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata & Details</h3>
        </div>

        <div>
          <label htmlFor="tag-input-form" className="block text-sm font-medium text-gray-900 mb-2">
            Tags
          </label>
          <div className="flex gap-2">
            <Input
              id="tag-input-form"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} size="md">Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="mt-3">
              <TagChips tags={tags} onRemove={removeTag} />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="location-input-form" className="block text-sm font-medium text-gray-900 mb-2">
            Locations
          </label>
          <div className="flex gap-2">
            <Input
              id="location-input-form"
              value={locInput}
              onChange={(e) => setLocInput(e.target.value)}
              placeholder="Add location..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLoc();
                }
              }}
            />
            <Button type="button" onClick={addLoc} size="md">Add</Button>
          </div>
          {locations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {locations.map((l) => (
                <LocationChip key={l} location={l} onRemove={() => removeLoc(l)} />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Travel Tips
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              value={tipInput}
              onChange={(e) => setTipInput(e.target.value)}
              placeholder="Tip text"
            />
            <Input
              value={tipAuthorInput}
              onChange={(e) => setTipAuthorInput(e.target.value)}
              placeholder="Author (optional)"
            />
            <Button type="button" onClick={addTip} size="md">Add tip</Button>
          </div>
          {tips.length > 0 && (
            <ul className="mt-4 space-y-2">
              {tips.map((t, idx) => (
                <li 
                  key={`${t.text}-${idx}`} 
                  className={cn(
                    "flex items-start justify-between rounded-lg",
                    "border border-gray-200 bg-gray-50 p-3"
                  )}
                >
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{t.text}</p>
                    {t.author && <p className="text-xs text-gray-500 mt-0.5">— {t.author}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTip(idx)}
                    className="text-xs rounded-md px-2 py-1 hover:bg-gray-200 transition-colors"
                    aria-label="Remove tip"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-900 mb-2">
              Author
            </label>
            <Input 
              id="author"
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              placeholder="Your name or handle" 
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className={cn(
                "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900",
                "hover:border-gray-400 focus:border-[color:var(--color-primary)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:ring-[rgba(37,99,235,0.6)] transition-colors cursor-pointer"
              )}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" loading={submitting} size="lg">
          {submitting ? "Saving..." : "Save Post"}
        </Button>
        <Link 
          href="/" 
          className={cn(
            "text-sm font-medium text-gray-600 hover:text-gray-900",
            "underline transition-colors"
          )}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
