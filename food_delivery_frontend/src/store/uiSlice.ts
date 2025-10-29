"use client";

import { StateCreator } from "zustand";
import { Toast, UIState } from "@/types/store";

export interface UISlice {
  ui: UIState;
  // PUBLIC_INTERFACE
  setLoading: (loading: boolean) => void;
  // PUBLIC_INTERFACE
  addToast: (toast: Omit<Toast, "id"> & { id?: string }) => string;
  // PUBLIC_INTERFACE
  removeToast: (id: string) => void;
  // PUBLIC_INTERFACE
  clearToasts: () => void;

  // Helpers
  // PUBLIC_INTERFACE
  toastSuccess: (message: string, title?: string, durationMs?: number) => string;
  // PUBLIC_INTERFACE
  toastError: (message: string, title?: string, durationMs?: number) => string;
  // PUBLIC_INTERFACE
  toastInfo: (message: string, title?: string, durationMs?: number) => string;
  // PUBLIC_INTERFACE
  toastWarning: (message: string, title?: string, durationMs?: number) => string;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set, get) => ({
  ui: {
    loading: false,
    toasts: [],
  },

  setLoading: (loading) => {
    set({ ui: { ...get().ui, loading } });
  },

  addToast: (toast) => {
    const id = toast.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const entry: Toast = {
      id,
      message: toast.message,
      type: toast.type,
      title: toast.title,
      durationMs: toast.durationMs ?? 3500,
    };
    set({ ui: { ...get().ui, toasts: [...get().ui.toasts, entry] } });

    // Optional auto removal
    if (entry.durationMs && entry.durationMs > 0 && typeof window !== "undefined") {
      window.setTimeout(() => {
        try {
          get().removeToast(id);
        } catch {
          // ignore if store not available
        }
      }, entry.durationMs);
    }

    return id;
  },

  removeToast: (id) => {
    set({ ui: { ...get().ui, toasts: get().ui.toasts.filter((t) => t.id !== id) } });
  },

  clearToasts: () => {
    set({ ui: { ...get().ui, toasts: [] } });
  },

  toastSuccess: (message, title = "Success", durationMs) =>
    get().addToast({ type: "success", message, title, durationMs }),
  toastError: (message, title = "Error", durationMs) =>
    get().addToast({ type: "error", message, title, durationMs }),
  toastInfo: (message, title = "Info", durationMs) =>
    get().addToast({ type: "info", message, title, durationMs }),
  toastWarning: (message, title = "Warning", durationMs) =>
    get().addToast({ type: "warning", message, title, durationMs }),
});
