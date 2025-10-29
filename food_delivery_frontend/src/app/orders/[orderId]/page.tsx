"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, type Order as ApiOrder } from "@/lib/api";
import { useAppStore } from "@/store/store";
import { createWebSocketClient } from "@/lib/ws";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import Loading from "@/components/common/Loading";
import ErrorState from "@/components/common/ErrorState";

/**
 * PUBLIC_INTERFACE
 * OrderStatusTimeline component displays the timeline of status updates for an order.
 */
function OrderStatusTimeline({
  status,
  steps,
  placedAt,
}: {
  status: string;
  steps: Array<{ key: string; label: string; description?: string }>;
  placedAt?: string | number | Date;
}) {
  // Map current status to completed index
  const currentIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  }, [status, steps]);

  return (
    <div className="relative">
      <ol className="relative border-l border-blue-200">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <li key={step.key} className="ml-6 mb-8">
              <span
                className={[
                  "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4",
                  isCompleted
                    ? "bg-blue-600 ring-blue-100"
                    : "bg-gray-200 ring-gray-100",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
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
                {step.description ??
                  (isCurrent
                    ? "In progress..."
                    : isCompleted
                    ? "Completed"
                    : "Pending")}
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
}

/**
 * PUBLIC_INTERFACE
 * LiveMapPlaceholder renders a stylized placeholder for a live map while not integrated.
 */
function LiveMapPlaceholder({
  restaurantName,
  dropoffAddress,
}: {
  restaurantName?: string;
  dropoffAddress?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-500/10 to-gray-50 p-4 shadow-sm">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.06)_25%,transparent_25%,transparent_50%,rgba(37,99,235,0.06)_50%,rgba(37,99,235,0.06)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-40" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-blue-800">
            Live Delivery Map
          </h3>
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
            Map placeholder (integrate with real map provider)
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * The page component for tracking an order by ID. It loads the order via REST, subscribes to WebSocket updates,
 * updates Zustand order state, and displays a status timeline with a live map placeholder.
 */
type OrderItemDetail = {
  itemId?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

type OrderDetail = {
  id: string;
  restaurant?: { id?: string; name?: string };
  items?: OrderItemDetail[];
  status?: string;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  deliveryAddress?: { line1?: string; city?: string; postcode?: string };
  createdAt?: string | number | Date;
};

type OrderStatusMessage = {
  type: "order_status";
  orderId: string;
  status: string;
  [key: string]: unknown;
};

export default function OrderTrackingPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId = params?.orderId;

  const { order, setActiveOrder, setOrderStatus } = useAppStore((s) => ({
    order: s.order,
    setActiveOrder: s.setActiveOrder,
    setOrderStatus: s.setOrderStatus,
  }));

  const [orderData, setOrderData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the standard steps for the order lifecycle
  const steps = useMemo(
    () => [
      { key: "PLACED", label: "Order Placed", description: "We received your order." },
      { key: "CONFIRMED", label: "Order Confirmed", description: "Restaurant confirmed your order." },
      { key: "PREPARING", label: "Preparing", description: "Your food is being prepared." },
      { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "Courier is on the way." },
      { key: "DELIVERED", label: "Delivered", description: "Order delivered. Enjoy!" },
    ],
    []
  );

  // Normalize status strings from backend to our store's OrderStatus union
  const normalizeStatus = (raw: string): "idle" | "creating" | "placed" | "confirmed" | "preparing" | "ready_for_pickup" | "out_for_delivery" | "delivered" | "cancelled" | "error" => {
    const s = raw.toLowerCase();
    if (s.includes("idle")) return "idle";
    if (s.includes("creating")) return "creating";
    if (s.includes("placed")) return "placed";
    if (s.includes("confirm")) return "confirmed";
    if (s.includes("prepar")) return "preparing";
    if (s.includes("ready")) return "ready_for_pickup";
    if (s.includes("out_for_delivery") || s.includes("out") || s.includes("delivery")) return "out_for_delivery";
    if (s.includes("deliver")) return "delivered";
    if (s.includes("cancel")) return "cancelled";
    return "error";
  };

  // Load order details via API with mock fallback provided by api.getOrderById
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!orderId) return;
      setLoading(true);
      setError(null);
      try {
        const data = (await getOrderById(orderId as string)) as unknown as ApiOrder | OrderDetail;
        if (!mounted) return;
        if (!data) {
          setError("Order not found");
          setLoading(false);
          return;
        }
        setOrderData(data);
        setActiveOrder(orderId as string);
        // Attempt to map backend status to our known steps if needed
        if (typeof data.status === "string") {
          setOrderStatus(normalizeStatus(data.status));
        }
      } catch (e: unknown) {
        console.error(e);
        if (mounted) setError("Failed to load order. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [orderId, setActiveOrder, setOrderStatus]);

  // Subscribe to WebSocket updates for this order
  useEffect(() => {
    if (!orderId) return;

    const client = createWebSocketClient();
    const offMessage = client.on("message", (payload: unknown) => {
      try {
        const parsed = (payload && typeof payload === "string" ? JSON.parse(payload) : payload) as Partial<OrderStatusMessage> | unknown;
        const data = parsed as Partial<OrderStatusMessage>;
        if (data?.type === "order_status" && data.orderId === orderId && typeof data.status === "string") {
          setOrderStatus(normalizeStatus(data.status));
        }
      } catch {
        // ignore
      }
    });

    // Attempt to subscribe if backend supports it
    client.send({ action: "subscribe", channel: "order", orderId });

    return () => {
      try {
        client.send({ action: "unsubscribe", channel: "order", orderId });
      } catch {
        // ignore
      }
      offMessage();
    };
  }, [orderId, setOrderStatus]);

  // Derive order to display
  if (!orderId) {
    return (
      <div className="p-6">
        <ErrorState
          title="Invalid request"
          message="Missing order ID."
          actions={
            <Button variant="secondary" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Loading label="Loading your order details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Unable to load order"
          message={error}
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="p-6">
        <ErrorState
          title="Order not found"
          message="We couldn't find this order. Please check the link or your order history."
          actions={
            <Button variant="secondary" onClick={() => router.push("/restaurants")}>
              Go to Restaurants
            </Button>
          }
        />
      </div>
    );
  }

  const status =
    (order?.status as string | undefined) ||
    (orderData?.status as string | undefined) ||
    "PLACED";

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Tracking
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your order in real-time. ID:{" "}
            <span className="font-mono text-gray-900">{orderId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {status.replaceAll("_", " ")}
          </span>
          <Button
            variant="secondary"
            onClick={() => router.push("/restaurants")}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Browse more
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Status Timeline</h2>
            </div>
            <div className="p-4">
              <OrderStatusTimeline status={status} steps={steps} placedAt={orderData.createdAt} />
            </div>
          </Card>

          <LiveMapPlaceholder
            restaurantName={orderData?.restaurant?.name}
            dropoffAddress={orderData?.deliveryAddress?.line1}
          />
        </div>

        <div className="md:col-span-1">
          <Card>
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm text-gray-600">Restaurant</div>
                <div className="font-medium text-gray-900">
                  {orderData?.restaurant?.name ?? "Restaurant"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Items</div>
                <ul className="list-inside list-disc text-sm text-gray-800">
                  {(orderData?.items || []).map((it: OrderItemDetail, idx: number) => {
                    const name = it.name || it.itemId || "Item";
                    const qty = it.quantity || 1;
                    const price = it.price || 0;
                    return (
                      <li key={idx}>
                        {qty} × {name}{" "}
                        <span className="text-gray-500">
                          {formatCurrency(price * qty)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(
                      orderData?.subtotal ??
                        (orderData?.items || []).reduce(
                          (sum: number, it: OrderItemDetail) => sum + (it.price || 0) * (it.quantity || 1),
                          0
                        )
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(orderData?.deliveryFee ?? 0)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-base font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      orderData?.total ??
                        ((orderData?.subtotal ??
                          (orderData?.items || []).reduce(
                            (sum: number, it: OrderItemDetail) => sum + (it.price || 0) * (it.quantity || 1),
                            0
                          )) +
                          (orderData?.deliveryFee ?? 0))
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  fullWidth
                  onClick={() => router.push("/cart")}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Reorder items
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
