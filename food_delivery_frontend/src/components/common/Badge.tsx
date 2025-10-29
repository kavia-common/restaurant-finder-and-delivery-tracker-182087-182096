"use client";

import React from "react";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * BadgeProps define the props for the Badge component.
 */
export type BadgeProps = {
  /** Visual style of the badge */
  variant?: "info" | "success" | "warning" | "danger" | "neutral";
  /** Optional rounded size */
  rounded?: "sm" | "md" | "full";
  /** Optional leading icon */
  leftIcon?: React.ReactNode;
  /** Children text/content */
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * Badge shows small, contextual labels with Ocean Professional theme styling.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "info",
  rounded = "md",
  leftIcon,
  children,
  className,
}) => {
  const base =
    "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 whitespace-nowrap";

  const roundedMap: Record<NonNullable<BadgeProps["rounded"]>, string> = {
    sm: "rounded",
    md: "rounded-md",
    full: "rounded-full",
  };

  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    success: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    warning: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
    neutral: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  };

  return (
    <span className={clsx(base, roundedMap[rounded], variants[variant], className)}>
      {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
