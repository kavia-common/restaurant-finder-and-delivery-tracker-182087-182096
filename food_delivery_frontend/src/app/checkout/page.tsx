"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useCart, useUser, useUI } from "@/store/store";
import { formatCurrency } from "@/lib/format";
import { createOrder } from "@/lib/api";

/**
 * Checkout Page
 * PUBLIC_INTERFACE
 * Implements a client-side authenticated checkout experience:
 * - Auth guard: redirect to /login if not authenticated
 * - Shows shipping address and payment placeholders
 * - Displays cart review and totals
 * - Places order via api.createOrder mock, clears cart, navigates to orders/[orderId]
 * Styling follows the Ocean Professional theme using Tailwind utilities.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const { cart, clearCart } = useCart();
  const { ui, setLoading, toastError, toastSuccess } = useUI();

  // Client-side auth guard
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isLoggedIn, router]);

  const hasItems = cart.items.length > 0;

  // Local placeholders for address and payment selection
  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    instructions: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.subtotal;
  const deliveryFee = useMemo(() => (hasItems ? 3.99 : 0), [hasItems]);
  const taxes = useMemo(() => +(subtotal * 0.08).toFixed(2), [subtotal]); // 8% sample tax
  const total = useMemo(
    () => Math.max(0, subtotal + deliveryFee + taxes),
    [subtotal, deliveryFee, taxes]
  );

  const validAddress = useMemo(() => {
    // Very light client validation
    return Boolean(
      address.fullName.trim() &&
        address.line1.trim() &&
        address.city.trim() &&
        address.state.trim() &&
        address.postalCode.trim()
    );
  }, [address]);

  const handlePlaceOrder = async () => {
    if (!hasItems) {
      toastError("Your cart is empty.");
      return;
    }
    if (!validAddress) {
      toastError("Please complete your address before placing the order.");
      return;
    }

    try {
      setPlacing(true);
      setLoading(true);

      // Prepare payload for mock createOrder
      const payload = {
        restaurantId: cart.restaurant?.id || cart.items[0]?.restaurantId,
        items: cart.items.map((it) => ({
          itemId: it.menuItemId,
          quantity: it.quantity,
          notes: it.notes,
        })),
        notes: address.instructions || undefined,
        address: [
          address.fullName,
          address.line1,
          address.line2,
          `${address.city}, ${address.state} ${address.postalCode}`,
          address.phone ? `Phone: ${address.phone}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
      };

      const order = await createOrder(payload);
      // clear cart upon success
      clearCart();
      toastSuccess("Order placed successfully!");
      // navigate to order details page
      router.push(`/orders/${order.id}`);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to place order. Please try again.";
      toastError(msg);
    } finally {
      setPlacing(false);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-1 text-sm text-gray-600">
          Complete your order from{" "}
          <span className="font-medium text-gray-900">
            {cart.restaurant?.name || "Selected Restaurant"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Address and Payment */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Delivery Address"
            actions={<span className="text-xs text-gray-500">All fields are placeholders</span>}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Full name
                </label>
                <input
                  value={address.fullName}
                  onChange={(e) => setAddress((s) => ({ ...s, fullName: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Address line 1
                </label>
                <input
                  value={address.line1}
                  onChange={(e) => setAddress((s) => ({ ...s, line1: e.target.value }))}
                  placeholder="123 Ocean Ave"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Address line 2 (optional)
                </label>
                <input
                  value={address.line2}
                  onChange={(e) => setAddress((s) => ({ ...s, line2: e.target.value }))}
                  placeholder="Apt, suite, etc."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">City</label>
                <input
                  value={address.city}
                  onChange={(e) => setAddress((s) => ({ ...s, city: e.target.value }))}
                  placeholder="Seaside"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">State</label>
                <input
                  value={address.state}
                  onChange={(e) => setAddress((s) => ({ ...s, state: e.target.value }))}
                  placeholder="CA"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Postal code
                </label>
                <input
                  value={address.postalCode}
                  onChange={(e) => setAddress((s) => ({ ...s, postalCode: e.target.value }))}
                  placeholder="90210"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">Phone</label>
                <input
                  value={address.phone}
                  onChange={(e) => setAddress((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Delivery instructions (optional)
                </label>
                <textarea
                  value={address.instructions}
                  onChange={(e) =>
                    setAddress((s) => ({ ...s, instructions: e.target.value }))
                  }
                  placeholder="Gate code, drop-off notes, etc."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </Card>

          <Card title="Payment">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                aria-label="Pay with card"
                onClick={() => setPaymentMethod("card")}
                className={`rounded-lg border p-3 text-left text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  paymentMethod === "card"
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Credit/Debit Card</span>
                  {paymentMethod === "card" ? (
                    <span className="text-xs font-semibold text-blue-700">Selected</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Placeholder only. No real card entry implemented.
                </p>
              </button>

              <button
                aria-label="Cash on delivery"
                onClick={() => setPaymentMethod("cod")}
                className={`rounded-lg border p-3 text-left text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  paymentMethod === "cod"
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                  {paymentMethod === "cod" ? (
                    <span className="text-xs font-semibold text-blue-700">Selected</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-600">Pay when your order arrives.</p>
              </button>
            </div>

            {/* Placeholder note to reflect Ocean Professional minimalist approach */}
            <p className="mt-3 text-xs text-gray-500">
              Payment forms are placeholders. In a real app, integrate a PCI-compliant provider.
            </p>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <Card
            title="Order Summary"
            footer={
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePlaceOrder}
                loading={placing || ui.loading}
                aria-label="Place order"
                disabled={!hasItems || !validAddress}
              >
                Place Order
              </Button>
            }
          >
            {!hasItems ? (
              <div className="rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-600">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-3">
                <ul className="space-y-2">
                  {cart.items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-gray-900">
                          {it.name}{" "}
                          <span className="text-gray-500">× {it.quantity}</span>
                        </p>
                      </div>
                      <span className="ml-3 font-medium text-gray-900">
                        {formatCurrency(it.price * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(taxes)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2 text-base">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
                  Secure checkout with Ocean Professional experience. Mocked API in use.
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
