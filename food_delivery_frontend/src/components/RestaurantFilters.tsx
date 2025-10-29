"use client";

import React from "react";
import clsx from "clsx";
import Button from "./common/Button";
import CategoryPill from "./CategoryPill";

/**
 * PUBLIC_INTERFACE
 * FilterState represents the filter values used in the restaurants listing.
 */
export type FilterState = {
  cuisine: string; // "All" or specific cuisine
  minRating: number | null; // 0..5
  priceRange: string | "Any"; // "$" | "$$" | "$$$" | "Any"
  query?: string;
};

/**
 * PUBLIC_INTERFACE
 * RestaurantFiltersProps describes props for the RestaurantFilters component.
 */
export type RestaurantFiltersProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  cuisineOptions?: string[];
  // Use a readonly tuple-like union array to keep literal types
  priceOptions?: ReadonlyArray<"Any" | "$" | "$$" | "$$$">;
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * RestaurantFilters renders cuisine, rating and price filters suitable for the restaurants page.
 * It follows the Ocean Professional theme with rounded surfaces and subtle shadows.
 */
export const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  value,
  onChange,
  cuisineOptions = ["All", "Seafood", "BBQ", "Italian", "Asian", "Burgers", "Desserts"],
  priceOptions = ["Any", "$", "$$", "$$$"] as const,
  className,
}) => {
  const setCuisine = (c: string) => onChange({ ...value, cuisine: c });
  const setRating = (r: number | null) => onChange({ ...value, minRating: r });
  const setPrice = (p: "Any" | "$" | "$$" | "$$$") =>
    onChange({ ...value, priceRange: p });

  return (
    <section aria-label="Filters" className={clsx("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              cuisine: "All",
              minRating: null,
              priceRange: "Any",
              query: value.query ?? "",
            })
          }
          aria-label="Clear filters"
        >
          Clear filters
        </Button>
      </div>

      {/* Cuisine pills */}
      <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
        {cuisineOptions.map((c) => (
          <CategoryPill
            key={c}
            label={c}
            selected={value.cuisine === c}
            onClick={() => setCuisine(c)}
          />
        ))}
      </div>

      {/* Rating and Price */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Minimum rating
          </label>
          <div className="flex flex-wrap gap-2">
            {[null, 3, 3.5, 4, 4.5].map((r, idx) => {
              const label = r === null ? "Any" : `${r}+`;
              const selected = value.minRating === r;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRating(r)}
                  className={clsx(
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    selected
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                  aria-pressed={selected}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <label className="block text-sm font-medium text-gray-900 mb-2">Price</label>
          <div className="flex flex-wrap gap-2">
            {priceOptions.map((p: "Any" | "$" | "$$" | "$$$") => {
              const selected = value.priceRange === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrice(p)}
                  className={clsx(
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    selected
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                  aria-pressed={selected}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantFilters;
