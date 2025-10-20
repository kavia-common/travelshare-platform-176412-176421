import { getSession } from "@/lib/auth/session";
import Link from "next/link";

export default async function NewPostGuard() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="app-container py-16">
        <h1 className="text-xl font-semibold mb-2">You need to log in</h1>
        <p className="text-gray-600">
          Please{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            log in
          </Link>{" "}
          to create a new post.
        </p>
      </div>
    );
  }
  // When authenticated, render the client page as-is (handled by default page.tsx)
  return null;
}
