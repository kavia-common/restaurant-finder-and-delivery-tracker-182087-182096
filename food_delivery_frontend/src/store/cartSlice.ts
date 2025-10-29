"use client";

import { StateCreator } from "zustand";
import { CartItem, CartState, ID, RestaurantInfo } from "@/types/store";

export interface CartSlice {
  cart: CartState;
  // PUBLIC_INTERFACE
  addItem: (item: Omit<CartItem, "id"> & { id?: ID }) => { replaced: boolean };
  // PUBLIC_INTERFACE
  updateItem: (id: ID, updates: Partial<Omit<CartItem, "id" | "restaurantId" | "restaurantName">>) => void;
  // PUBLIC_INTERFACE
  removeItem: (id: ID) => void;
  // PUBLIC_INTERFACE
  clearCart: () => void;
  // PUBLIC_INTERFACE
  setRestaurant: (restaurant: RestaurantInfo | null) => void;
  // PUBLIC_INTERFACE
  recalc: () => void;

  // Selectors
  // PUBLIC_INTERFACE
  getItemsByRestaurant: (restaurantId?: ID | null) => CartItem[];
  // PUBLIC_INTERFACE
  getSubtotal: () => number;
  // PUBLIC_INTERFACE
  getTotalQuantity: () => number;
}

const computeTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const totalQuantity = items.reduce((acc, it) => acc + it.quantity, 0);
  return { subtotal, totalQuantity };
};

export const createCartSlice: StateCreator<CartSlice, [], [], CartSlice> = (set, get) => ({
  cart: {
    items: [],
    restaurant: null,
    subtotal: 0,
    totalQuantity: 0,
  },

  addItem: (input) => {
    const current = get().cart;
    const incomingRestaurant: RestaurantInfo = {
      id: input.restaurantId,
      name: input.restaurantName,
    };

    let replaced = false;
    let nextItems: CartItem[] = [...current.items];

    // Enforce single restaurant constraint
    if (current.restaurant && current.restaurant.id !== incomingRestaurant.id) {
      // Different restaurant: replace entire cart
      nextItems = [];
      replaced = true;
    }

    // Set/replace restaurant
    const restaurant =
      !current.restaurant || replaced
        ? incomingRestaurant
        : current.restaurant;

    // If same menuItemId and options, increase quantity; otherwise push new line
    const existingIndex = nextItems.findIndex(
      (it) =>
        it.menuItemId === input.menuItemId &&
        it.restaurantId === input.restaurantId &&
        JSON.stringify(it.options ?? {}) === JSON.stringify(input.options ?? {})
    );

    if (existingIndex >= 0) {
      const existing = nextItems[existingIndex];
      nextItems[existingIndex] = {
        ...existing,
        quantity: existing.quantity + (input.quantity ?? 1),
        notes: input.notes ?? existing.notes,
      };
    } else {
      const id = input.id ?? `${input.menuItemId}-${Date.now()}`;
      nextItems.push({
        ...input,
        id,
        quantity: Math.max(1, input.quantity ?? 1),
      });
    }

    const totals = computeTotals(nextItems);

    set({
      cart: {
        items: nextItems,
        restaurant,
        subtotal: totals.subtotal,
        totalQuantity: totals.totalQuantity,
      },
    });

    return { replaced };
  },

  updateItem: (id, updates) => {
    const { cart } = get();
    const idx = cart.items.findIndex((i) => i.id === id);
    if (idx < 0) return;

    const nextItems = [...cart.items];
    const prev = nextItems[idx];

    const merged: CartItem = {
      ...prev,
      ...updates,
      // ensure minimum quantity 1
      quantity:
        updates.quantity !== undefined ? Math.max(1, updates.quantity) : prev.quantity,
    };

    nextItems[idx] = merged;
    const totals = computeTotals(nextItems);
    set({
      cart: {
        ...cart,
        items: nextItems,
        subtotal: totals.subtotal,
        totalQuantity: totals.totalQuantity,
      },
    });
  },

  removeItem: (id) => {
    const { cart } = get();
    const nextItems = cart.items.filter((i) => i.id !== id);
    const totals = computeTotals(nextItems);
    set({
      cart: {
        items: nextItems,
        restaurant: nextItems.length ? cart.restaurant : null,
        subtotal: totals.subtotal,
        totalQuantity: totals.totalQuantity,
      },
    });
  },

  clearCart: () => {
    set({
      cart: {
        items: [],
        restaurant: null,
        subtotal: 0,
        totalQuantity: 0,
      },
    });
  },

  setRestaurant: (restaurant) => {
    const { cart } = get();
    // if changing restaurant, reset items to enforce constraint
    const nextRestaurant = restaurant ?? null;
    const items =
      !nextRestaurant || (cart.restaurant && cart.restaurant.id === nextRestaurant.id)
        ? cart.items
        : [];
    const totals = computeTotals(items);
    set({
      cart: {
        items,
        restaurant: nextRestaurant,
        subtotal: totals.subtotal,
        totalQuantity: totals.totalQuantity,
      },
    });
  },

  recalc: () => {
    const { cart } = get();
    const totals = computeTotals(cart.items);
    set({
      cart: {
        ...cart,
        subtotal: totals.subtotal,
        totalQuantity: totals.totalQuantity,
      },
    });
  },

  getItemsByRestaurant: (restaurantId) => {
    const { cart } = get();
    if (!restaurantId) return cart.items;
    return cart.items.filter((i) => i.restaurantId === restaurantId);
  },

  getSubtotal: () => get().cart.subtotal,

  getTotalQuantity: () => get().cart.totalQuantity,
});
