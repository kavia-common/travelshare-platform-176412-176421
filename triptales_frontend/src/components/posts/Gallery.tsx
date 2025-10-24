import type { PostImage } from '@/types/post';

// PUBLIC_INTERFACE
export default function Gallery({ images }: { images: PostImage[] }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((img, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.publicId || img.url || idx}
          src={img.url}
          alt={`Photo ${idx + 1}`}
          className="w-full h-48 object-cover rounded-lg"
        />
      ))}
    </div>
  );
}
