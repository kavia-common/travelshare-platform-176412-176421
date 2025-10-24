import { Navbar } from './Navbar';

// PUBLIC_INTERFACE
export default async function NavbarServer() {
  /** Server component wrapper for Navbar to provide session if available. */
  // Placeholder: In real app, read auth session from cookies or server.
  const session = null;
  return <Navbar session={session} />;
}
