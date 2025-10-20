import React from "react";

export default function NotFound() {
  return (
    <main className="app-container" role="main" aria-labelledby="nf-title">
      <section className="card" role="alert" aria-live="assertive">
        <header className="header">
          <h1 id="nf-title" className="title">404 – Page Not Found</h1>
          <p className="subtitle">The page you’re looking for doesn’t exist.</p>
        </header>
      </section>
    </main>
  );
}
