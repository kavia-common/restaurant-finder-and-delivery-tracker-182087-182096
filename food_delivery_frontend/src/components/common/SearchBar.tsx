"use client";

import React from "react";
import clsx from "clsx";
import Button from "./Button";

/**
 * PUBLIC_INTERFACE
 * SearchBarProps define the props for the SearchBar component.
 */
export type SearchBarProps = {
  /** Controlled value */
  value: string;
  /** onChange callback with next value */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional onSubmit for enter key or button click */
  onSubmit?: (value: string) => void;
  /** Debounce time in ms for onChange, 0 to disable */
  debounceMs?: number;
  /** Additional className */
  className?: string;
  /** aria-label for input if placeholder is absent */
  "aria-label"?: string;
};

/**
 * Debounce hook to delay calling effect until after wait milliseconds have elapsed.
 */
function useDebouncedCallback(cb: (value: string) => void, wait: number) {
  const timeoutRef = React.useRef<number | undefined>(undefined);

  const debounced = React.useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        cb(value);
      }, wait);
    },
    [cb, wait]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}

/**
 * PUBLIC_INTERFACE
 * SearchBar provides an accessible text input with an integrated search and clear action.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search restaurants, cuisines…",
  onSubmit,
  debounceMs = 0,
  className,
  ...ariaProps
}) => {
  const [internal, setInternal] = React.useState(value);

  React.useEffect(() => {
    setInternal(value);
  }, [value]);

  const emitChange = React.useCallback(
    (next: string) => {
      onChange(next);
    },
    [onChange]
  );

  // Create debounced callback unconditionally to satisfy hooks rules.
  const debouncedEmit = useDebouncedCallback(emitChange, debounceMs);
  const debouncedChange = React.useCallback(
    (next: string) => {
      if (debounceMs <= 0) {
        emitChange(next);
      } else {
        debouncedEmit(next);
      }
    },
    [debounceMs, emitChange, debouncedEmit]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInternal(next);
    debouncedChange(next);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit?.(internal);
  };

  const clear = () => {
    setInternal("");
    onChange("");
    onSubmit?.("");
  };

  return (
    <form onSubmit={handleSubmit} className={clsx("w-full", className)} role="search">
      <label className="sr-only" htmlFor="restaurant-search">
        {ariaProps["aria-label"] || "Search"}
      </label>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <input
            id="restaurant-search"
            type="search"
            value={internal}
            onChange={handleInput}
            placeholder={placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            aria-label={ariaProps["aria-label"] || "Search input"}
            autoComplete="off"
          />
          {internal && (
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Clear search"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.707-10.707a1 1 0 00-1.414-1.414L10 7.586 8.707 6.293a1 1 0 10-1.414 1.414L8.586 9l-1.293 1.293a1 1 0 101.414 1.414L10 10.414l1.293 1.293a1 1 0 001.414-1.414L11.414 9l1.293-1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <Button type="submit" variant="primary" aria-label="Search">
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
