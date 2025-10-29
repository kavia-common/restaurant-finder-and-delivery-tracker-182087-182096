"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * AddressForm
 * Placeholder form for delivery address collection. Not used directly yet (inlined on Checkout),
 * but provided as a reusable component for future refactor.
 */
export type Address = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  instructions?: string;
};

export type AddressFormProps = {
  value: Address;
  onChange: (next: Address) => void;
  className?: string;
};

export const AddressForm: React.FC<AddressFormProps> = ({ value, onChange, className }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-800">Full name</label>
          <input
            value={value.fullName}
            onChange={(e) => onChange({ ...value, fullName: e.target.value })}
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-800">Address line 1</label>
          <input
            value={value.line1}
            onChange={(e) => onChange({ ...value, line1: e.target.value })}
            placeholder="123 Ocean Ave"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Address line 2 (optional)
          </label>
          <input
            value={value.line2 || ""}
            onChange={(e) => onChange({ ...value, line2: e.target.value })}
            placeholder="Apt, suite, etc."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">City</label>
          <input
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            placeholder="Seaside"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">State</label>
          <input
            value={value.state}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            placeholder="CA"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">Postal code</label>
          <input
            value={value.postalCode}
            onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
            placeholder="90210"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">Phone</label>
          <input
            value={value.phone || ""}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Delivery instructions (optional)
          </label>
          <textarea
            value={value.instructions || ""}
            onChange={(e) => onChange({ ...value, instructions: e.target.value })}
            placeholder="Gate code, drop-off notes, etc."
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
