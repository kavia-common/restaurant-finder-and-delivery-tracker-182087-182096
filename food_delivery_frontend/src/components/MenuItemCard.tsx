"use client";

import React from "react";
import Image from "next/image";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";
import type { MenuItem } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * MenuItemCardProps describes props for MenuItemCard.
 */
export type MenuItemCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * MenuItemCard - Renders a single menu item with add-to-cart controls.
 */
export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAdd, className }) => {
  return (
    <Card className={className ? className : "h-full"}>
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-gray-50">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">{item.name}</h4>
          {item.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</span>
            <Button size="sm" variant="secondary" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;
