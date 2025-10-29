"use client";

import React from "react";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/common/SearchBar";
import Loading from "@/components/common/Loading";
import ErrorState from "@/components/common/ErrorState";
import Button from "@/components/common/Button";
import { getRestaurants, Restaurant } from "@/lib/api";
import RestaurantFilters, { FilterState } from "@/components/RestaurantFilters";

/**
 * PUBLIC_INTERFACE
 * RestaurantsPage - Lists restaurants with search, cuisine/rating/price filters, and pagination placeholder.
 * Uses mock getRestaurants() from api.ts. Provides loading and error states, follows theme.
 */
export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<FilterState>({
    cuisine: "All",
    minRating: null,
    priceRange: "Any",
    query: "",
  });

  // Simple pagination placeholder (client-side)
  const [page, setPage] = React.useState(1);
  const pageSize = 8;

  React.useEffect(() => {
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

  // Apply filters
  const filtered = React.useMemo(() => {
    let result = restaurants;

    // Cuisine
    if (filters.cuisine !== "All") {
      result = result.filter(
        (r) => r.cuisine.toLowerCase() === filters.cuisine.toLowerCase()
      );
    }

    // Rating
    if (filters.minRating != null) {
      result = result.filter((r) => (r.rating ?? 0) >= (filters.minRating ?? 0));
    }

    // Price - since our Restaurant type includes optional priceRange "$", "$$", "$$$"
    if (filters.priceRange !== "Any") {
      result = result.filter((r) => (r.priceRange ?? "").trim() === filters.priceRange);
    }

    // Text query (from dedicated search input)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }

    return result;
  }, [restaurants, filters, query]);

  // Pagination calculations
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const paginated = filtered.slice(pageStart, pageEnd);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getRestaurants()
      .then((d) => setRestaurants(d))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load restaurants")
      )
      .finally(() => setLoading(false));
  };

  // Reset to first page whenever filters or search change
  React.useEffect(() => {
    setPage(1);
  }, [query, filters]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header / Search */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-500/10 to-gray-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Restaurants
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Explore nearby places and order your favorites.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <SearchBar
              value={query}
              onChange={(q) => {
                setQuery(q);
                setFilters((f) => ({ ...f, query: q }));
              }}
              onSubmit={(q) => {
                setQuery(q);
                setFilters((f) => ({ ...f, query: q }));
              }}
              placeholder="Search restaurants or cuisines…"
              debounceMs={200}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <RestaurantFilters value={filters} onChange={setFilters} />

      {/* Results header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          {total} {total === 1 ? "restaurant" : "restaurants"}
        </h2>
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loading label="Loading restaurants" />
      ) : error ? (
        <ErrorState
          title="Could not load restaurants"
          message={error}
          onRetry={handleRetry}
        />
      ) : total === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
          No restaurants match your search.
        </div>
      ) : (
        <>
          <div
            className="
              grid gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {paginated.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>

          {/* Pagination placeholder controls */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{pageStart + 1}</span>–
              <span className="font-medium">
                {Math.min(pageEnd, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>

          {/* Infinite-scroll placeholder note */}
          <p className="mt-2 text-center text-xs text-gray-500">
            Tip: Replace these buttons with infinite scroll by observing the
            viewport and fetching next pages from a real API.
          </p>
        </>
      )}
    </div>
  );
}
