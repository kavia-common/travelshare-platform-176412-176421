"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { signupSchema, type SignupInput } from "@/lib/validation/authSchemas";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [form, setForm] = useState<SignupInput>({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFieldErrors(errors);
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
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className={cn(
        "w-full max-w-md px-6",
        "bg-white rounded-2xl shadow-xl border border-gray-100/50 p-8"
      )}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4",
            "bg-gradient-to-br from-[color:var(--color-secondary)] to-amber-500",
            "text-white text-xl font-bold shadow-lg"
          )}>
            T
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join TripTales
          </h1>
          <p className="text-sm text-gray-600">
            Create an account to share your adventures
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <div
            role="alert"
            className={cn(
              "mb-6 rounded-lg border border-red-200 bg-red-50",
              "text-red-700 px-4 py-3 text-sm flex items-start gap-2"
            )}
          >
            <span className="text-red-500 font-bold">✕</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5" aria-label="Sign up form">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || "Minimum 8 characters"}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
            variant="secondary"
          >
            Sign up
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              className="font-medium text-[color:var(--color-primary)] hover:underline" 
              href={"/auth/login" as Route}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
