import React from "react";
import Image from "next/image";
import type { PostImage } from "@/types/post";

// PUBLIC_INTERFACE
export default function Gallery({ images }: { images: PostImage[] }) {
  if (!images || images.length === 0) return null;
  return (
    <ul role="list" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {images.map((img, idx) => (
        <li key={img.publicId} className="relative aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={img.url}
            alt={`Gallery image ${idx + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
