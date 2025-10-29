"use client";

import Image from "next/image";
import React from "react";
import { CartItem as CartItemType } from "@/types/store";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/store/store";

/**
 * PUBLIC_INTERFACE
 * CartItem
 * Renders a single cart item with quantity controls, remove button, and item details.
 */
export interface CartItemProps {
  item: CartItemType;
  onRemove?: (id: string) => void;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onIncrease,
  onDecrease,
  className,
}) => {
  const { updateItem, removeItem } = useCart();

  const handleIncrease = () => {
    if (onIncrease) return onIncrease(item.id);
    updateItem(item.id, { quantity: item.quantity + 1 });
  };

  const handleDecrease = () => {
    if (onDecrease) return onDecrease(item.id);
    // Keep minimum quantity at 1
    updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) });
  };

  const handleRemove = () => {
    if (onRemove) return onRemove(item.id);
    removeItem(item.id);
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow ${className ?? ""}`}
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="truncate text-sm font-semibold text-gray-900">
              {item.name}
            </p>
            {item.options && Object.keys(item.options).length > 0 ? (
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                {Object.entries(item.options)
                  .map(([k, v]) => `${k}: ${String(v)}`)
                  .join(", ")}
              </p>
            ) : null}
            {item.notes ? (
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-400 italic">
                “{item.notes}”
              </p>
            ) : null}
          </div>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
            <button
              aria-label={`Decrease quantity for ${item.name}`}
              onClick={handleDecrease}
              className="px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              −
            </button>
            <span className="px-3 text-sm font-medium text-gray-900">
              {item.quantity}
            </span>
            <button
              aria-label={`Increase quantity for ${item.name}`}
              onClick={handleIncrease}
              className="px-2.5 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              +
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            aria-label={`Remove ${item.name} from cart`}
            onClick={handleRemove}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
