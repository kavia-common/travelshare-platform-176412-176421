import React from "react";

/**
 * Compatibility error page for Next.js expecting a Pages Router _error during some build flows.
 * This delegates to the existing App Router error boundary's simple UI.
 */
export default function ErrorPage() {
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
