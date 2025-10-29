import type { Metadata } from "next";

/**
 * PUBLIC_INTERFACE
 * generateStaticParams
 * Provides static params for the dynamic [orderId] route so that Next.js `output: export`
 * can statically generate the pages. In a real app, this should fetch recent orders for
 * the authenticated user or a representative set from the backend. For now, we return
 * a small placeholder list to satisfy export builds and allow demo navigation.
 */
export function generateStaticParams() {
  // Placeholder order IDs for static export. Replace with fetched IDs as needed.
  return [
    { orderId: "sample-1001" },
    { orderId: "sample-1002" },
    { orderId: "sample-1003" },
  ];
}

// Optional: Provide default metadata for the route
export const metadata: Metadata = {
  title: "Order Details | Ocean Eats",
  description: "Track your order status and delivery progress.",
};
