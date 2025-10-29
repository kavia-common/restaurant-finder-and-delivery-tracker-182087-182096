"use client";

import React, { useState } from "react";
import { useCart } from "@/store/store";
import { formatCurrency } from "@/lib/format";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

/**
 * PUBLIC_INTERFACE
 * CartSummary
 * Displays order summary, coupon input (placeholder), clear cart, and proceed button.
 */
export interface CartSummaryProps {
  onCheckout?: () => void;
  onClear?: () => void;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckout,
  onClear,
  className,
}) => {
  const { cart, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");

  const subtotal = cart.subtotal;
  // Placeholder discount logic: If any coupon text is present, show a fake 5% discount
  const discount = coupon.trim() ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleClear = () => {
    if (onClear) return onClear();
    clearCart();
  };

  const handleCheckout = () => {
    if (onCheckout) return onCheckout();
    // Navigate to checkout page when it's implemented
    // For now, we can route to a placeholder path
    if (typeof window !== "undefined") {
      window.location.href = "/checkout";
    }
  };

  return (
    <Card
      className={`w-full ${className ?? ""}`}
      title="Order Summary"
      actions={null}
      footer={
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleCheckout}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-gray-900">
              {discount > 0 ? `− ${formatCurrency(discount)}` : formatCurrency(0)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2 text-base">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="coupon" className="text-sm font-medium text-gray-800">
            Coupon Code
          </label>
          <div className="flex items-center gap-2">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter code (placeholder)"
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
            <Button
              variant="ghost"
              aria-label="Apply coupon code"
              onClick={() => {
                // No real validation; the presence of text triggers discount in UI
              }}
            >
              Apply
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Coupon validation is not implemented. Any text applies a sample discount.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="danger"
            fullWidth
            aria-label="Clear cart"
            onClick={handleClear}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CartSummary;
