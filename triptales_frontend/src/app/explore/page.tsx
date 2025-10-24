import Link from 'next/link';

export default function ExplorePage() {
  return (
    <main className="app-container section-spacing">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Explore</h1>
      <p className="text-gray-600">Use filters and search to discover TripTales.</p>
      <div className="mt-6">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
