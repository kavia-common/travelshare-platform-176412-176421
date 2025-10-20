import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white/70" role="contentinfo">
      <div className="app-container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} TripTales. All rights reserved.
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6 text-sm text-gray-600">
            <li><a className="hover:text-[color:var(--color-primary)]" href="/privacy">Privacy</a></li>
            <li><a className="hover:text-[color:var(--color-primary)]" href="/terms">Terms</a></li>
            <li><a className="hover:text-[color:var(--color-primary)]" href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
