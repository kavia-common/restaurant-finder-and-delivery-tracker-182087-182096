"use client";

import React from "react";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";

/**
 * PUBLIC_INTERFACE
 * AddToCartBarProps describes props for the AddToCartBar.
 */
export type AddToCartBarProps = {
  subtotal: number;
  quantity: number;
  restaurantName?: string;
  onViewCart?: () => void;
};

/**
 * PUBLIC_INTERFACE
 * AddToCartBar - Sticky footer bar summarizing cart for current restaurant, with CTA to view cart/checkout.
 */
export const AddToCartBar: React.FC<AddToCartBarProps> = ({
  subtotal,
  quantity,
  restaurantName,
  onViewCart,
}) => {
  if (quantity <= 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-white/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {quantity} {quantity === 1 ? "item" : "items"} in cart{" "}
            {restaurantName ? `• ${restaurantName}` : ""}
          </p>
          <p className="text-xs text-gray-600">Subtotal: {formatCurrency(subtotal)}</p>
        </div>
        <Button variant="primary" size="md" onClick={onViewCart} aria-label="View cart">
          View cart • {formatCurrency(subtotal)}
        </Button>
      </div>
    </div>
  );
};

export default AddToCartBar;
