"use client";

import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * OrderStatusStep represents a single step in the order lifecycle.
 */
export type OrderStatusStep = {
  /** Unique key for the step, e.g., 'PLACED' */
  key: string;
  /** Human-readable label for the step */
  label: string;
  /** Optional description displayed under the label */
  description?: string;
};

/**
 * PUBLIC_INTERFACE
 * Props for the OrderStatusTimeline component.
 */
export type OrderStatusTimelineProps = {
  /** Current status key among the steps */
  status: string;
  /** Ordered list of lifecycle steps to render */
  steps: OrderStatusStep[];
  /** Optional placement timestamp */
  placedAt?: string | number | Date;
  /** Optional className for container */
  className?: string;
};

/**
 * PUBLIC_INTERFACE
 * OrderStatusTimeline - Accessible vertical timeline for order status.
 * - Uses a list with aria-current for the active step
 * - High contrast colors and focus styles aligned with Ocean Professional theme
 */
export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  status,
  steps,
  placedAt,
  className,
}) => {
  // Map current status to completed index
  const currentIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  }, [status, steps]);

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      <ol className="relative border-l border-blue-200" role="list" aria-label="Order progress">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const defaultDescription = isCurrent
            ? "In progress..."
            : isCompleted
            ? "Completed"
            : "Pending";

          return (
            <li
              key={step.key}
              className="ml-6 mb-8"
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                aria-hidden="true"
                className={[
                  "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4",
                  isCompleted ? "bg-blue-600 ring-blue-100" : "bg-gray-200 ring-gray-100",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    role="img"
                    aria-label={isCurrent ? "Current step complete" : "Step complete"}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414L8.75 14.664a1 1 0 01-1.414 0L3.293 10.62a1 1 0 011.414-1.415L7.75 12.25l7.543-7.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                )}
              </span>
              <h4
                className={[
                  "mb-1 text-sm font-semibold",
                  isCurrent ? "text-blue-700" : "text-gray-800",
                ].join(" ")}
              >
                {step.label}
              </h4>
              <p className="text-xs text-gray-600">
                {step.description ?? defaultDescription}
              </p>
              {idx < steps.length - 1 && (
                <div className="mt-4 h-4 w-full border-b border-dashed border-gray-200" />
              )}
            </li>
          );
        })}
      </ol>
      {placedAt && (
        <div className="mt-4 text-xs text-gray-500">
          Placed at: {new Date(placedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default OrderStatusTimeline;
