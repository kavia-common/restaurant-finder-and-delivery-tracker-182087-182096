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
      ((set, get, _store) => {
        // capture store reference and getter for use inside persist options (like migrate)
        const capturedStore = _store;
        const capturedGet = get;

        // compose slices with the same set/get/store to ensure a single source of truth
        const composed = {
          ...createCartSlice(set, capturedGet, capturedStore),
          ...createUserSlice(set, capturedGet, capturedStore),
          ...createOrderSlice(set, capturedGet, capturedStore),
          ...createUISlice(set, capturedGet, capturedStore),
        } as StoreSlices;

        return composed;
      }) as StateCreator<StoreSlices>,
      // Options object defined as a function to capture get via closure
      ((getOptionsGet => ({
        name: "food-app-store",
        version: STORAGE_VERSION,
        // Zustand's PersistOptions expects the same state type; we intentionally persist only a subset.
        // Casting here keeps runtime behavior correct while satisfying TS.
        partialize: ((state: StoreSlices): PersistedShape => ({
          cart: state.cart,
          user: state.user,
        })) as unknown as (state: StoreSlices) => StoreSlices,
        storage: createJSONStorage(() => {
          // Provide a valid storage implementation for both browser and SSR environments
          if (typeof window !== "undefined" && window?.localStorage) {
            return window.localStorage;
          }
          // Minimal no-op in-memory storage to satisfy StateStorage type during SSR
          const memory = new Map<string, string>();
          return {
            getItem: (name: string) => Promise.resolve(memory.get(name) ?? null),
            setItem: (name: string, value: string) => {
              memory.set(name, value);
              return Promise.resolve();
            },
            removeItem: (name: string) => {
              memory.delete(name);
              return Promise.resolve();
            },
          };
        }),
        // Use a typed migrate that applies our migration map
        migrate: (
          persistedState: unknown,
          fromVersion: number
        ): StoreSlices | Promise<StoreSlices> => {
          // Use the latest in-memory state as baseline
          const current = getOptionsGet();

          if (!persistedState || typeof persistedState !== "object") {
            return current as StoreSlices;
          }

          // We persisted only a subset (PersistedShape). Migrate that subset if needed.
          const partial = persistedState as PersistedShape;

          let migratedSubset = partial;
          if (fromVersion !== STORAGE_VERSION) {
            const migration = migrations[STORAGE_VERSION];
            migratedSubset = migration ? migration(partial) : partial;
          }

          // Merge migrated subset back into the current full state shape
          const merged: StoreSlices = {
            ...(current as StoreSlices),
            cart: migratedSubset.cart ?? (current as StoreSlices).cart,
            user: migratedSubset.user ?? (current as StoreSlices).user,
          };

          return merged;
        },
      }))( // immediately invoke with a getter that will be set at runtime via a temporary store
        // We provide a safe getter that reads from the global store instance
        () => {
          try {
            return useAppStore.getState() as StoreSlices;
          } catch {
            // fallback to empty object cast if store not yet initialized
            return {} as StoreSlices;
          }
        }
      ))
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
