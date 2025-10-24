import type { PostTip } from '@/types/post';

// PUBLIC_INTERFACE
export default function TipList({ tips }: { tips: PostTip[] }) {
  if (!tips || tips.length === 0) {
    return <p className="text-gray-600">No tips added yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {tips.map((t, idx) => (
        <li key={`${t.text}-${idx}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-800">{t.text}</p>
          {t.author && <p className="text-xs text-gray-500 mt-0.5">— {t.author}</p>}
        </li>
      ))}
    </ul>
  );
}
