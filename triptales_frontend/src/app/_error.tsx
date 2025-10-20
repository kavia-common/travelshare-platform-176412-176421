"use client";

import React from "react";

/**
 * Legacy fallback for Next.js expecting `/_error` during certain build flows.
 * App Router primarily uses `app/error.tsx`, which already exists, but this file
 * prevents build-time PageNotFoundError: Cannot find module for page: /_error.
 */
export default function LegacyError() {
  return (
    <html>
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            background: "#f9fafb",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "1.5rem",
              maxWidth: 600,
              width: "100%",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: 0 }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: "#4b5563" }}>
              An unexpected error occurred.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
