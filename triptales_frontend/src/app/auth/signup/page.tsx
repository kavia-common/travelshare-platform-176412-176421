"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { signupSchema, type SignupInput } from "@/lib/validation/authSchemas";
import { getFocusRing } from "@/lib/theme";

export default function SignupPage() {
  const [form, setForm] = useState<SignupInput>({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.details?.[0]?.message || "Failed to sign up");
        setLoading(false);
        return;
      }
      window.location.assign("/" as Route);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="app-container max-w-md w-full mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-2">Sign up</h1>
      <p className="text-sm text-gray-600 mb-6">
        Create your TripTales account.
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" aria-label="Sign up form">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 ${getFocusRing()}`}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 ${getFocusRing()}`}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 ${getFocusRing()}`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md bg-[color:var(--color-secondary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-105 disabled:opacity-60 ${getFocusRing()}`}
          aria-busy={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-700">
        Already have an account?{" "}
        <Link className="text-[color:var(--color-primary)] underline" href={"/auth/login" as Route}>
          Log in
        </Link>
      </p>
    </div>
  );
}
