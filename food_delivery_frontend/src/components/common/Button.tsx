"use client";

import React from "react";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * ButtonProps are the props for the themed Button component.
 */
export type ButtonProps = {
  /** Visual style of the button */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Optional leading icon */
  leftIcon?: React.ReactNode;
  /** Optional trailing icon */
  rightIcon?: React.ReactNode;
  /** Loading state to show spinner and disable interaction */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Button type attribute */
  type?: "button" | "submit" | "reset";
  /** Accessible label when content is icon-only */
  "aria-label"?: string;
  /** onClick handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Children inside button */
  children?: React.ReactNode;
  /** Additional className to merge */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * Button is a reusable component that follows the Ocean Professional theme and Tailwind.
 * It supports multiple variants and sizes and is fully accessible.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  children,
  className,
  ...ariaProps
}) => {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
  };

  // Ocean Professional theme colors via Tailwind
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 ring-offset-white",
    secondary:
      "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 ring-offset-white",
    ghost:
      "bg-transparent text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-300 ring-offset-white border border-blue-200",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 ring-offset-white",
  };

  const width = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      className={clsx(base, sizes[size], variants[variant], width, className)}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      onClick={onClick}
      {...ariaProps}
    >
      {loading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent"
          aria-hidden="true"
        />
      )}
      {leftIcon && !loading ? (
        <span className="inline-flex items-center" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children ? <span className="truncate">{children}</span> : null}
      {rightIcon && !loading ? (
        <span className="inline-flex items-center" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
};

export default Button;
