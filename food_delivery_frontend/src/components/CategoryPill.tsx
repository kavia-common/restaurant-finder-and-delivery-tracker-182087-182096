"use client";

import React from "react";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * CategoryPillProps describe props for the category button/pill.
 */
export type CategoryPillProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * CategoryPill renders a rounded pill button for filtering categories.
 */
export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition",
        selected
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
};

export default CategoryPill;
