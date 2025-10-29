"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "@/lib/api";
import { useUser, useUI } from "@/store/store";
import Button from "@/components/common/Button";

/**
 * PUBLIC_INTERFACE
 * RegisterPage allows users to create an account using the mocked API.
 * Wrapped in Suspense to satisfy Next.js requirement for useSearchParams during static export.
 */
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, setToken, setProfile } = useUser();
  const { toastError, toastSuccess } = useUI();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectTo);
    }
  }, [isLoggedIn, redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toastError("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await register({ name, email, password });
      setToken(res.token);
      setProfile({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
      });
      toastSuccess("Account created! Welcome to OceanEats.");
      router.replace(redirectTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center py-10">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-600">Join OceanEats in a few seconds.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth loading={submitting} aria-label="Create account">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-medium text-blue-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 max-w-md text-gray-600">Loading…</div>}>
      <RegisterContent />
    </Suspense>
  );
}
