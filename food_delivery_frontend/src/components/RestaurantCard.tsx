"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import clsx from "clsx";
import { Restaurant } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * Props for RestaurantCard component
 */
export type RestaurantCardProps = {
  restaurant: Restaurant;
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * RestaurantCard renders a single restaurant with image, name, cuisine, rating and delivery time.
 * It follows the Ocean Professional theme with rounded corners and subtle shadow.
 */
export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, className }) => {
  const { id, name, cuisine, rating, deliveryTimeMin, imageUrl, priceRange } = restaurant;

  return (
    <Link
      href={`/restaurants/${id}`}
      className={clsx(
        "group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-blue-50 to-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} restaurant image`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            Image unavailable
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{name}</h3>
          {priceRange ? (
            <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              {priceRange}
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1 text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {rating.toFixed(1)}
          </span>
          <span aria-hidden="true">•</span>
          <span>{cuisine}</span>
          <span aria-hidden="true">•</span>
          <span>{deliveryTimeMin} min</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
