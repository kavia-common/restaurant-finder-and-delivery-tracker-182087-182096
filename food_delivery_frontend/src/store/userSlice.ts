"use client";

import { StateCreator } from "zustand";
import { ID, UserProfile, UserState } from "@/types/store";

export interface UserSlice {
  user: UserState;
  // PUBLIC_INTERFACE
  setToken: (token: string | null) => void;
  // PUBLIC_INTERFACE
  setProfile: (profile: UserProfile | null) => void;
  // PUBLIC_INTERFACE
  logout: () => void;
  // PUBLIC_INTERFACE
  isLoggedIn: () => boolean;
  // PUBLIC_INTERFACE
  getUserId: () => ID | null;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set, get) => ({
  user: {
    token: null,
    profile: null,
    isAuthenticated: false,
  },

  setToken: (token) => {
    const { user } = get();
    set({
      user: {
        ...user,
        token,
        isAuthenticated: !!token,
      },
    });
  },

  setProfile: (profile) => {
    const { user } = get();
    set({
      user: {
        ...user,
        profile,
        isAuthenticated: !!(user.token || profile),
      },
    });
  },

  logout: () => {
    set({
      user: {
        token: null,
        profile: null,
        isAuthenticated: false,
      },
    });
  },

  isLoggedIn: () => !!get().user.isAuthenticated,

  getUserId: () => get().user.profile?.id ?? null,
});
