"use client";

import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, PersistOptions, createJSONStorage } from "zustand/middleware";

/**
 * PersistOptions in zustand expects the same type as store by default.
 * We will use a widened options type to allow partialize to return a narrowed subset for persistence.
 */
import { createCartSlice, CartSlice } from "./cartSlice";
import { createUserSlice, UserSlice } from "./userSlice";
import { createOrderSlice, OrderSlice } from "./orderSlice";
import { createUISlice, UISlice } from "./uiSlice";

// App storage versioning for migrations
const STORAGE_VERSION = 1;

// Define store composition and persisted shape
type StoreSlices = CartSlice & UserSlice & OrderSlice & UISlice;

// Migrations for persisted state shape changes
// Placeholder: expand when shape changes; must handle previous versions safely.
type MigrationMap<T> = Record<number, (state: T) => T>;
type PersistedShape = Pick<StoreSlices, "cart" | "user">;

const migrations: MigrationMap<PersistedShape> = {
  0: (state) => state,
  1: (state) => {
    // example no-op migration for version bump
    return state;
  },
};

// Strictly type a persist wrapper that maintains our StoreSlices typing
type PersistWrapper<T> = (
  config: StateCreator<T, [], [], T>,
  // Allow options to be typed to the store while we cast partialize locally
  options: PersistOptions<T>
) => StateCreator<T, [], [], T>;

const persistPartial = persist as unknown as PersistWrapper<StoreSlices>;

export const useAppStore = create<StoreSlices>()(
  devtools(
    persistPartial(
      ((...a: Parameters<StateCreator<StoreSlices>>): StoreSlices => ({
        ...createCartSlice(...a),
        ...createUserSlice(...a),
        ...createOrderSlice(...a),
        ...createUISlice(...a),
      })) as StateCreator<StoreSlices>,
      {
        name: "food-app-store",
        version: STORAGE_VERSION,
        // Zustand's PersistOptions expects the same state type; we intentionally persist only a subset.
        // Casting here keeps runtime behavior correct while satisfying TS.
        partialize: ((state: StoreSlices): PersistedShape => ({
          cart: state.cart,
          user: state.user,
        })) as unknown as (state: StoreSlices) => StoreSlices,
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? window.localStorage : undefined
        ),
        // Use a typed migrate that applies our migration map
        migrate: (
          persisted: PersistedShape | undefined,
          fromVersion: number
        ): PersistedShape | undefined => {
          if (!persisted) return persisted;
          if (fromVersion === STORAGE_VERSION) return persisted;
          const next = migrations[STORAGE_VERSION];
          const result: PersistedShape = next ? next(persisted) : persisted;
          return result;
        },
      }
    )
  )
);

// PUBLIC_INTERFACE
export const useCart = () =>
  useAppStore((s) => ({
    cart: s.cart,
    addItem: s.addItem,
    updateItem: s.updateItem,
    removeItem: s.removeItem,
    clearCart: s.clearCart,
    setRestaurant: s.setRestaurant,
    recalc: s.recalc,
    getItemsByRestaurant: s.getItemsByRestaurant,
    getSubtotal: s.getSubtotal,
    getTotalQuantity: s.getTotalQuantity,
  }));

// PUBLIC_INTERFACE
export const useUser = () =>
  useAppStore((s) => ({
    user: s.user,
    setToken: s.setToken,
    setProfile: s.setProfile,
    logout: s.logout,
    isLoggedIn: s.isLoggedIn,
    getUserId: s.getUserId,
  }));

// PUBLIC_INTERFACE
export const useOrder = () =>
  useAppStore((s) => ({
    order: s.order,
    setActiveOrder: s.setActiveOrder,
    setOrderStatus: s.setOrderStatus,
    setSubscribedToUpdates: s.setSubscribedToUpdates,
    clearOrder: s.clearOrder,
    hasActiveOrder: s.hasActiveOrder,
  }));

// PUBLIC_INTERFACE
export const useUI = () =>
  useAppStore((s) => ({
    ui: s.ui,
    setLoading: s.setLoading,
    addToast: s.addToast,
    removeToast: s.removeToast,
    clearToasts: s.clearToasts,
    toastSuccess: s.toastSuccess,
    toastError: s.toastError,
    toastInfo: s.toastInfo,
    toastWarning: s.toastWarning,
  }));

// Adapter for Next.js App Router if we ever need to wrap providers (Zustand doesn't require a Provider)
// PUBLIC_INTERFACE
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // no-op wrapper for future compatibility (e.g., with context bridges)
  return children as React.ReactElement;
};
