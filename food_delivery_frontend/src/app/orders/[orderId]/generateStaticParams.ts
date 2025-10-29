import type { Metadata } from "next";

/**
 * PUBLIC_INTERFACE
 * generateStaticParams - Provides minimal static params for orders page when using output: export.
 * Since orders are dynamic and user-specific, we provide an empty list so the route can build.
 */
export async function generateStaticParams(): Promise<Array<{ orderId: string }>> {
  // In a real app, you could pre-render recent public demo orders.
  // For static export in this template, return an empty list.
  return [];
}

/**
 * PUBLIC_INTERFACE
 * metadata - Optional page-level metadata to ensure consistent static export behavior.
 */
export const metadata: Metadata = {
  // Keeping metadata minimal
  title: "Order",
  description: "Order details",
};
