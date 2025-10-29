import React from "react";
import RestaurantDetailClient from "./client-page";
import { getRestaurants } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * generateStaticParams - server-side export for static site generation with output: export
 */
export async function generateStaticParams() {
  try {
    const restaurants = await getRestaurants();
    return restaurants.map((r) => ({ id: r.id }));
  } catch {
    return [{ id: "r_1" }, { id: "r_2" }];
  }
}

/**
 * PUBLIC_INTERFACE
 * RestaurantDetailPage - Server wrapper that renders the client page.
 */
export default function RestaurantDetailPage() {
  return <RestaurantDetailClient />;
}
