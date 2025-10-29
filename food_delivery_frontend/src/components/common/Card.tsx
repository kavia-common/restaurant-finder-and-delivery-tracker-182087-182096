"use client";

import React from "react";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * CardProps define the props for the Card container component.
 */
export type CardProps = {
  /** Optional title displayed in header area */
  title?: React.ReactNode;
  /** Optional actions area displayed in header right side */
  actions?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Children for the content area */
  children?: React.ReactNode;
  /** Optional clickable behavior */
  onClick?: () => void;
  /** Make the whole card focusable/selectable */
  interactive?: boolean;
  /** Additional className */
  className?: string;
  /** Role override for accessibility */
  role?: React.AriaRole;
};

/**
 * PUBLIC_INTERFACE
 * Card is a surface component with subtle shadow, rounded corners, and gradient header line.
 */
export const Card: React.FC<CardProps> = ({
  title,
  actions,
  footer,
  children,
  onClick,
  interactive = false,
  className,
  role,
}) => {
  const base =
    "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-md";
  const interactiveClasses = interactive
    ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    : "";

  return (
    <div
      className={clsx(base, interactiveClasses, className)}
      onClick={onClick}
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={interactive ? 0 : -1}
    >
      {(title || actions) && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
          <div className="flex items-center justify-between gap-3">
            {title ? <h3 className="text-sm font-semibold text-gray-900">{title}</h3> : <span />}
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        </div>
      )}
      <div className="px-4 py-4">{children}</div>
      {footer && <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">{footer}</div>}
    </div>
  );
};

export default Card;
