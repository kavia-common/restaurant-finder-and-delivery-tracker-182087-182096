"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/store/store";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

/**
 * Cart Page
 * PUBLIC_INTERFACE
 * Displays the user's cart with items list, controls to update quantities or remove, and an order summary sidebar.
 * - Uses Zustand cartSlice for state management
 * - Responsive layout: stacked on mobile, 2-column on larger screens
 * - Provides a placeholder coupon input and clear cart action
 * - Shows total items and restaurant name if available
 */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/store/store";

export default function CartPage() {
  const { cart } = useCart();
  const router = useRouter();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?redirect=/cart");
    }
  }, [isLoggedIn, router]);

  const hasItems = cart.items.length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {cart.restaurant ? (
          <p className="mt-1 text-sm text-gray-600">
            From <span className="font-medium text-gray-900">{cart.restaurant.name}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-600">Choose a restaurant to start adding items.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {!hasItems ? (
            <Card
              title="Your cart is empty"
              actions={
                <Link
                  href="/restaurants"
                  className="text-sm font-medium text-blue-700 hover:underline"
                >
                  Browse restaurants
                </Link>
              }
            >
              <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Looks like you haven&apos;t added anything yet.
                </p>
                <Link href="/restaurants">
                  <Button variant="primary">Find something delicious</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {cart.items.map((it) => (
                <CartItem key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
