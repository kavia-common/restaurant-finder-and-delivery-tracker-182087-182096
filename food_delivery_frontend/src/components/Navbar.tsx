"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Navbar component provides the top navigation for the app.
 * - Brand/logo linking to home
 * - Search input that syncs with query params (?q=)
 * - Auth state placeholder (Sign in button / Avatar)
 * - Cart indicator with count
 *
 * This is a client component due to router/search interactions.
 */
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Controlled search input synchronized with query string
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [cartCount, setCartCount] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);

  // Simulate reading auth and cart from localStorage (placeholder until integrated with real state)
  useEffect(() => {
    try {
      const storedCart = JSON.parse(
        (typeof window !== "undefined" && localStorage.getItem("cart")) || "[]"
      );
      setCartCount(Array.isArray(storedCart) ? storedCart.length : 0);

      const token =
        typeof window !== "undefined" && localStorage.getItem("auth_token");
      setIsAuthed(Boolean(token));
    } catch {
      // no-op
    }
  }, [pathname]);

  // Keep query in sync if URL changes externally
  useEffect(() => {
    const sp = searchParams.get("q") ?? "";
    setQuery(sp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image
                src="/favicon.ico"
                alt="Logo"
                fill
                sizes="32px"
                className="rounded"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              OceanEats
            </span>
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={onSubmit}
          className="hidden flex-1 items-center justify-center px-6 md:flex"
          role="search"
        >
          <div className="relative w-full max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              aria-label="Search restaurants or dishes"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* Actions */}
        <nav aria-label="Top navigation actions" className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-blue-600"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthed ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50 px-2.5 py-1.5 text-sm text-gray-800 shadow-sm transition hover:from-blue-100 hover:to-gray-50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                ME
              </div>
              <span className="hidden sm:inline">Account</span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile search */}
      <div className="block border-t border-gray-100 px-4 py-3 md:hidden">
        <form onSubmit={onSubmit} role="search">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-16 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              aria-label="Search restaurants or dishes"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
