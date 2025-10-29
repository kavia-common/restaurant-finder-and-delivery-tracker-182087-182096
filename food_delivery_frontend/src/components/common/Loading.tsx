"use client";

import React from "react";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * LoadingProps define the props for the Loading indicator.
 */
export type LoadingProps = {
  /** Optional label for screen readers */
  label?: string;
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Inline vs block layout */
  inline?: boolean;
  /** Additional class names */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * Loading shows a progress spinner aligned with the Ocean Professional theme.
 */
export const Loading: React.FC<LoadingProps> = ({
  label = "Loading",
  size = "md",
  inline = false,
  className,
}) => {
  const sizes: Record<NonNullable<LoadingProps["size"]>, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={clsx(
        inline ? "inline-flex items-center gap-2" : "flex items-center justify-center gap-3 py-6",
        className
      )}
    >
      <span
        className={clsx(
          "inline-block animate-spin rounded-full border-blue-600/40 border-t-blue-600",
          sizes[size]
        )}
        aria-hidden="true"
      />
      <span className="text-sm text-gray-600">{label}…</span>
    </div>
  );
};

export default Loading;
