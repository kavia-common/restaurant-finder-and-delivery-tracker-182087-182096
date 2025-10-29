"use client";

import { useEffect, useMemo, useState } from "react";
import { getRestaurants, Restaurant } from "@/lib/api";
import RestaurantCard from "@/components/RestaurantCard";
import Loading from "@/components/common/Loading";
import ErrorState from "@/components/common/ErrorState";
import CategoryPill from "@/components/CategoryPill";
import SearchBar from "@/components/common/SearchBar";

/**
 * Home page shows:
 * - Hero section with themed gradient, title, subtitle, and search
 * - Categories horizontal scroll
 * - Featured restaurants grid (from mock API)
 * Includes loading and error states and responsive layout.
 */
export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  // Available categories - could be dynamic, for now static aligned with mock
  const categories = useMemo(
    () => ["All", "Seafood", "BBQ", "Italian", "Asian", "Burgers", "Desserts"],
    []
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getRestaurants()
      .then((data) => {
        if (!alive) return;
        setRestaurants(data);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load restaurants");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = restaurants;
    if (selectedCategory !== "All") {
      result = result.filter((r) => r.cuisine.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }
    return result;
  }, [restaurants, selectedCategory, query]);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 sm:p-10">
        <div className="relative z-10 grid gap-6 sm:grid-cols-2 sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Discover the best food around you
            </h1>
            <p className="mt-2 max-w-prose text-gray-600">
              OceanEats helps you find top-rated restaurants and order your favorites with fast delivery.
            </p>

            <div className="mt-5 max-w-xl">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={setQuery}
                placeholder="Search restaurants, cuisines, or dishes…"
                debounceMs={200}
              />
              <p className="mt-2 text-xs text-gray-500">
                Tip: Try “Seafood” or “BBQ”
              </p>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="relative mx-auto h-40 w-40 rotate-6 rounded-2xl bg-white/60 shadow-lg ring-1 ring-blue-100 backdrop-blur">
              <div className="absolute inset-0 -rotate-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50" />
              <div className="absolute inset-4 rounded-xl border border-blue-200 bg-white/70 shadow-inner" />
              <div className="absolute bottom-3 left-3 rounded-lg bg-amber-500 px-2 py-1 text-xs font-semibold text-white shadow">
                30m avg
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow">
                4.5+
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
      </section>

      {/* Categories */}
      <section aria-label="Categories" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Browse by category</h2>
        </div>
        <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section aria-label="Featured restaurants" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Featured</h2>
          <span className="text-sm text-gray-500">{filtered.length} options</span>
        </div>

        {loading ? (
          <Loading label="Loading restaurants" />
        ) : error ? (
          <ErrorState
            title="Could not load restaurants"
            message={error}
            onRetry={() => {
              // simple retry by reloading the page data
              setLoading(true);
              setError(null);
              getRestaurants()
                .then((d) => setRestaurants(d))
                .catch((e) =>
                  setError(e instanceof Error ? e.message : "Failed to load restaurants")
                )
                .finally(() => setLoading(false));
            }}
          />
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
            No restaurants match your search.
          </div>
        ) : (
          <div
            className="
              grid gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
