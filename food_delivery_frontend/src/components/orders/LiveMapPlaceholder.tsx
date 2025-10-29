"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * Props for the LiveMapPlaceholder component.
 */
export type LiveMapPlaceholderProps = {
  /** Restaurant name for the pickup location card */
  restaurantName?: string;
  /** Drop-off address for the destination card */
  dropoffAddress?: string;
  /** Optional className */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * LiveMapPlaceholder renders a stylized placeholder for a live map while not integrated.
 * It maintains visual consistency with the Ocean Professional theme.
 */
export const LiveMapPlaceholder: React.FC<LiveMapPlaceholderProps> = ({
  restaurantName,
  dropoffAddress,
  className,
}) => {
  return (
    <section
      aria-label="Live delivery map placeholder"
      className={[
        "relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-500/10 to-gray-50 p-4 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.06)_25%,transparent_25%,transparent_50%,rgba(37,99,235,0.06)_50%,rgba(37,99,235,0.06)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-40"
      />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-blue-800">Live Delivery Map</h3>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            Simulated
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
          <div className="rounded-lg bg-white/70 p-3 shadow-inner">
            <div className="text-xs text-gray-500">Pickup</div>
            <div className="font-medium">{restaurantName ?? "Restaurant"}</div>
          </div>
          <div className="rounded-lg bg-white/70 p-3 shadow-inner">
            <div className="text-xs text-gray-500">Drop-off</div>
            <div className="font-medium">{dropoffAddress ?? "Your Address"}</div>
          </div>
        </div>
        <div className="mt-4 h-40 w-full rounded-lg border border-blue-100 bg-white/80 shadow-inner">
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            Map placeholder (integrate with a real provider)
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveMapPlaceholder;
