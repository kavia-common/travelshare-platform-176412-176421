import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { Navbar as ClientNavbar } from "./Navbar";

export default async function NavbarServer() {
  // Access cookies to ensure dynamic rendering when auth cookie changes
  const c = await cookies();
  c.get("tt_session");
  const session = await getSession();

  return (
    <div>
      {/* Use existing client navbar for core nav/link styling */}
      <ClientNavbar />
      {/* Supplemental actions to reflect auth state on smaller screens */}
      <div className="md:hidden px-4 py-2 border-b border-gray-200 flex gap-3 items-center">
        <Link href="/explore" className="text-sm text-gray-700 hover:text-gray-900">Explore</Link>
        <Link href="/posts/new" className="text-sm rounded-md bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700 transition">New Post</Link>
        <div className="ml-auto">
          {session ? (
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="text-sm rounded-md bg-gray-100 text-gray-800 px-3 py-1.5 hover:bg-gray-200 transition"
              >
                Log out
              </button>
            </form>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="text-sm text-gray-700 hover:text-gray-900">Log in</Link>
              <Link href="/auth/signup" className="text-sm rounded-md bg-amber-500 text-white px-3 py-1.5 hover:bg-amber-600 transition">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
