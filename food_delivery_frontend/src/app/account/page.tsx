"use client";

import React from "react";
import { useUser } from "@/store/store";

/**
 * PUBLIC_INTERFACE
 * AccountPage placeholder to show current user info and confirm login state.
 */
export default function AccountPage() {
  const { user } = useUser();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Your Account</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {user?.isAuthenticated ? (
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Name: </span>
              <span className="font-medium text-gray-900">{user.profile?.name ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-600">Email: </span>
              <span className="font-medium text-gray-900">{user.profile?.email ?? "—"}</span>
            </div>
            <div>
              <span className="text-gray-600">User ID: </span>
              <span className="font-mono text-gray-900">{user.profile?.id ?? "—"}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">You are not signed in.</div>
        )}
      </div>
    </div>
  );
}
