"use client";

import { StateCreator } from "zustand";
import { ID, OrderState, OrderStatus } from "@/types/store";

export interface OrderSlice {
  order: OrderState;
  // PUBLIC_INTERFACE
  setActiveOrder: (orderId: ID | null) => void;
  // PUBLIC_INTERFACE
  setOrderStatus: (status: OrderStatus) => void;
  // PUBLIC_INTERFACE
  setSubscribedToUpdates: (subscribed: boolean) => void;
  // PUBLIC_INTERFACE
  clearOrder: () => void;

  // Selectors
  // PUBLIC_INTERFACE
  hasActiveOrder: () => boolean;
}

export const createOrderSlice: StateCreator<OrderSlice, [], [], OrderSlice> = (set, get) => ({
  order: {
    activeOrderId: null,
    status: "idle",
    subscribedToUpdates: false,
    lastUpdatedAt: null,
  },

  setActiveOrder: (orderId) => {
    set({
      order: {
        ...get().order,
        activeOrderId: orderId,
        status: orderId ? "placed" : "idle",
        lastUpdatedAt: Date.now(),
      },
    });
  },

  setOrderStatus: (status) => {
    set({
      order: {
        ...get().order,
        status,
        lastUpdatedAt: Date.now(),
      },
    });
  },

  setSubscribedToUpdates: (subscribed) => {
    set({
      order: {
        ...get().order,
        subscribedToUpdates: subscribed,
        lastUpdatedAt: Date.now(),
      },
    });
  },

  clearOrder: () => {
    set({
      order: {
        activeOrderId: null,
        status: "idle",
        subscribedToUpdates: false,
        lastUpdatedAt: Date.now(),
      },
    });
  },

  hasActiveOrder: () => !!get().order.activeOrderId,
});
