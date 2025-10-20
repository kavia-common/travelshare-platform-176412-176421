"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getFocusRing } from "@/lib/theme";

type UploadedAsset = {
  url: string;
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
};

export type ImageUploaderProps = {
  /** Emitted when uploads complete (successful ones only). */
  onChange?: (assets: UploadedAsset[]) => void;
  /** Allow at most N files per selection. Default 10. */
  maxFiles?: number;
  /** Maximum file size in bytes. Default 10 MB. */
  maxFileSize?: number;
  /** Default folder to upload into (must be allow-listed on server). */
  folder?: "triptales/posts" | "triptales/avatars" | "triptales/tmp";
  /** Additional className for container. */
  className?: string;
};

// Limit defaults
const DEFAULT_MAX_FILES = 10;
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type LocalFile = {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number; // 0-100
  error?: string;
};

function isImageFile(f: File) {
  return f.type.startsWith("image/");
}

// Create a unique id for a file instance
function uid() {
  return Math.random().toString(36).slice(2);
}

// POST to our signing endpoint to get signature and details
async function getSignedParams(requested: { folder?: string }) {
  const res = await fetch("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requested),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.details?.[0]?.message || `Signing failed with ${res.status}`);
  }
  return (await res.json()) as {
    signature: string;
    timestamp: number;
    api_key: string;
    cloud_name: string;
    upload_preset?: string;
    params: Record<string, string | number>;
  };
}

async function getPublicConfig() {
  const res = await fetch("/api/uploads/sign", { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.details?.[0]?.message || `Config load failed with ${res.status}`);
  }
  return (await res.json()) as { cloud_name: string; api_key: string; upload_preset?: string };
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  folder = "triptales/posts",
  className,
}) => {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup previews
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [files]);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      setError(null);
      if (!list) return;

      const accepted: LocalFile[] = [];
      for (let i = 0; i < list.length; i++) {
        const file = list.item(i)!;
        if (!isImageFile(file)) {
          setError("Only image files are allowed.");
          continue;
        }
        if (file.size > maxFileSize) {
          setError(`File ${file.name} exceeds the size limit of ${Math.round(maxFileSize / (1024 * 1024))}MB.`);
          continue;
        }
        accepted.push({
          id: uid(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "pending",
          progress: 0,
        });
      }

      const total = files.length + accepted.length;
      if (total > maxFiles) {
        setError(`Too many files. You can upload up to ${maxFiles} images.`);
      }

      setFiles((prev) => [...prev, ...accepted].slice(0, maxFiles));
    },
    [files.length, maxFiles, maxFileSize]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input to allow same file selection again
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  // Keyboard support for dropzone
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFileDialog();
    }
  };

  const uploadAll = async () => {
    setError(null);
    // Start with signing request
    let signed;
    try {
      signed = await getSignedParams({ folder });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to initialize upload.";
      setError(msg);
      return;
    }

    // Also compute upload URL and ensure public cloud name available
    let pubCfg;
    try {
      pubCfg = await getPublicConfig();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load upload configuration.";
      setError(msg);
      return;
    }
    const uploadUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(pubCfg.cloud_name)}/auto/upload`;

    const successful: UploadedAsset[] = [];
    // Upload each pending file sequentially for simpler progress reporting (could be parallel with concurrency limit)
    for (const f of files) {
      if (f.status === "success") continue;

      // mark uploading
      setFiles((prev) => prev.map((p) => (p.id === f.id ? { ...p, status: "uploading", progress: 0 } : p)));

      try {
        const form = new FormData();
        // Required fields
        form.set("file", f.file);
        form.set("api_key", signed.api_key);
        form.set("timestamp", String(signed.timestamp));
        form.set("signature", signed.signature);
        // Optional preset
        if (signed.upload_preset) form.set("upload_preset", signed.upload_preset);
        // Any additional signed params returned
        Object.entries(signed.params).forEach(([k, v]) => {
          // avoid duplicates (timestamp/upload_preset already set)
          if (k === "timestamp" || k === "upload_preset") return;
          form.set(k, String(v));
        });

        // Use XMLHttpRequest to track progress
        const xhr = new XMLHttpRequest();
        const progressPromise = new Promise<Response>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.round((evt.loaded / evt.total) * 100);
              setFiles((prev) => prev.map((p) => (p.id === f.id ? { ...p, progress: pct } : p)));
            }
          });
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status >= 200 && xhr.status < 300) {
                // Create a Response-like object
                resolve(
                  new Response(xhr.responseText, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: new Headers({ "Content-Type": xhr.getResponseHeader("Content-Type") || "application/json" }),
                  })
                );
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          };
          xhr.open("POST", uploadUrl, true);
          xhr.send(form);
        });

        const res = await progressPromise;
        const data = await res.json();
        // Expected Cloudinary response fields
        const asset: UploadedAsset = {
          url: data.url,
          secure_url: data.secure_url,
          public_id: data.public_id,
          width: data.width,
          height: data.height,
        };
        successful.push(asset);

        setFiles((prev) =>
          prev.map((p) => (p.id === f.id ? { ...p, status: "success", progress: 100 } : p))
        );
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        setFiles((prev) =>
          prev.map((p) =>
            p.id === f.id ? { ...p, status: "error", error: msg } : p
          )
        );
      }
    }

    if (successful.length > 0) {
      onChange?.(successful);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const hasPending = files.some((f) => f.status === "pending");
  const hasUploading = files.some((f) => f.status === "uploading");

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onClick={openFileDialog}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-white p-6 text-center",
          isDragging ? "border-[color:var(--color-primary)] bg-blue-50" : "border-gray-300 hover:border-gray-400",
          getFocusRing()
        )}
        aria-label="Upload images. Drag and drop images here or press Enter or Space to browse."
        title="Drag and drop images here or press Enter or Space to browse"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <div className="text-3xl">📷</div>
        <p className="text-sm text-gray-700">
          Drag and drop images here, or click to select
        </p>
        <p className="text-xs text-gray-500">
          Up to {maxFiles} images, max {Math.round(maxFileSize / (1024 * 1024))}MB each
        </p>
      </div>

      {error && (
        <div role="alert" className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">Selected images ({files.length})</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!hasPending || hasUploading}
                onClick={uploadAll}
                className={cn(
                  "text-sm px-3 py-2 rounded-md text-white bg-[color:var(--color-primary)] shadow-sm",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  getFocusRing()
                )}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setFiles([])}
                disabled={hasUploading}
                className={cn(
                  "text-sm px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  getFocusRing()
                )}
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((f) => (
              <li key={f.id} className="relative rounded-md overflow-hidden border border-gray-200 bg-white">
                {/* Using <img> for local blob preview. next/image is not suitable for blob object URLs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="h-32 w-full object-cover"
                  role="presentation"
                />
                <div className="p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-gray-700" title={f.file.name}>
                      {f.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      disabled={f.status === "uploading"}
                      aria-label={`Remove ${f.file.name}`}
                      className={cn(
                        "text-xs px-2 py-1 rounded-md text-gray-700 hover:bg-gray-100",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        getFocusRing()
                      )}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 h-2 w-full rounded bg-gray-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-2 transition-all",
                        f.status === "success"
                          ? "bg-amber-500"
                          : f.status === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      )}
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>

                  <div className="mt-1 text-[11px] text-gray-600">
                    {f.status === "pending" && "Pending"}
                    {f.status === "uploading" && `Uploading… ${f.progress}%`}
                    {f.status === "success" && "Uploaded"}
                    {f.status === "error" && <span className="text-red-600">{f.error || "Error"}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
