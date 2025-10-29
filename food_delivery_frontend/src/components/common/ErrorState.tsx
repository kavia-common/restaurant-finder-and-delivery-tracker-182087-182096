"use client";

import React from "react";
import Button from "./Button";
import clsx from "clsx";

/**
 * PUBLIC_INTERFACE
 * ErrorStateProps define the props for the ErrorState component.
 */
export type ErrorStateProps = {
  /** Title for error */
  title?: string;
  /** Detailed message */
  message?: string;
  /** Optional action to retry */
  onRetry?: () => void;
  /** Optional custom actions node to override default retry */
  actions?: React.ReactNode;
  /** Additional className */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * ErrorState shows a user-friendly error message with optional retry action.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We couldn’t complete your request. Please try again.",
  onRetry,
  actions,
  className,
}) => {
  return (
    <div
      role="alert"
      className={clsx(
        "w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-800",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
          !
        </span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          {message && <p className="mt-1 text-sm text-red-700">{message}</p>}
          <div className="mt-3 flex items-center gap-2">
            {actions ? (
              actions
            ) : onRetry ? (
              <Button variant="primary" size="sm" onClick={onRetry} aria-label="Retry action">
                Retry
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
