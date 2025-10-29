"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api";
import { useUser, useUI } from "@/store/store";
import Button from "@/components/common/Button";

/**
 * PUBLIC_INTERFACE
 * LoginPage provides a simple email/password login flow using the mocked API.
 * - On success: sets token and profile in Zustand user slice and redirects to redirect param or home.
 * - On failure: shows a toast error.
 * - Client-side only; compatible with static export as it's pure client behavior.
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, setToken, setProfile } = useUser();
  const { toastError, toastSuccess } = useUI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isLoggedIn()) {
      // If already logged in, redirect immediately
      router.replace(redirectTo);
    }
  }, [isLoggedIn, redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toastError("Please provide both email and password.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await login({ email, password });
      // Persist into Zustand store
      setToken(res.token);
      setProfile({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
      });
      toastSuccess("Signed in successfully!");
      router.replace(redirectTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center py-10">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back to OceanEats. Please enter your details.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth loading={submitting} aria-label="Sign in">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-medium text-blue-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
