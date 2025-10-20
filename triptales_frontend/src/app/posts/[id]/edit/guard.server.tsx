import { getSession } from "@/lib/auth/session";
import Link from "next/link";
import type { Route } from "next";

export default async function EditPostGuard() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="app-container py-16">
        <h1 className="text-xl font-semibold mb-2">You need to log in</h1>
        <p className="text-gray-600">
          Please{" "}
          <Link href={"/auth/login" as Route} className="text-blue-600 hover:underline">
            log in
          </Link>{" "}
          to edit this post.
        </p>
      </div>
    );
  }
  return null;
}
