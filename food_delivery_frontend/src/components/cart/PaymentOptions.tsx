"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * PaymentOptions
 * Simple placeholder for selecting a payment option.
 */
export type PaymentMethod = "card" | "cod";

export type PaymentOptionsProps = {
  value: PaymentMethod;
  onChange: (next: PaymentMethod) => void;
  className?: string;
};

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          aria-label="Pay with card"
          onClick={() => onChange("card")}
          className={`rounded-lg border p-3 text-left text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            value === "card"
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Credit/Debit Card</span>
            {value === "card" ? (
              <span className="text-xs font-semibold text-blue-700">Selected</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Placeholder only. No real card entry implemented.
          </p>
        </button>

        <button
          aria-label="Cash on delivery"
          onClick={() => onChange("cod")}
          className={`rounded-lg border p-3 text-left text-sm shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            value === "cod"
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Cash on Delivery</span>
            {value === "cod" ? (
              <span className="text-xs font-semibold text-blue-700">Selected</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-gray-600">Pay when your order arrives.</p>
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Payment forms are placeholders. In a real app, integrate a PCI-compliant provider.
      </p>
    </div>
  );
};

export default PaymentOptions;
