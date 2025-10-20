import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session-impl.server";
import { Navbar as ClientNavbar } from "./Navbar";

/**
 * PUBLIC_INTERFACE
 * NavbarServer - Server component that reads the auth session and passes it to the client Navbar.
 * Ensures hydration boundary reflects cookie changes by touching the cookie store.
 */
export default async function NavbarServer() {
  // Access cookies to ensure dynamic rendering when auth cookie changes
  const c = await cookies();
  c.get("tt_session");
  const session = await getSession();

  // Delegate rendering to client Navbar with session info
  return <ClientNavbar session={session} />;
}
