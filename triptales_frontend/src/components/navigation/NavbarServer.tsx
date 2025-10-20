import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session-impl.server";
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
      <div className="md:hidden px-4 py-2 border-b border-gray-200 flex gap-3 items-center" role="navigation" aria-label="Primary">
        <Link href="/explore" className="text-sm text-gray-700 hover:text-gray-900" aria-label="Explore posts">Explore</Link>
        <Link href="/posts/new" className="text-sm rounded-md bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700 transition" aria-label="Create a new post">New Post</Link>
        <div className="ml-auto">
          {session ? (
            <form action="/api/auth/logout" method="post" aria-label="Logout form">
              <button
                type="submit"
                className="text-sm rounded-md bg-gray-100 text-gray-800 px-3 py-1.5 hover:bg-gray-200 transition"
                aria-label="Log out"
              >
                Log out
              </button>
            </form>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="text-sm text-gray-700 hover:text-gray-900" aria-label="Log in">Log in</Link>
              <Link href="/auth/signup" className="text-sm rounded-md bg-amber-500 text-white px-3 py-1.5 hover:bg-amber-600 transition" aria-label="Sign up">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
