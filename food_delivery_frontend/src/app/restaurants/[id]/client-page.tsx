"use client";

import React from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { getRestaurantById, MenuItem, Restaurant } from "@/lib/api";
import Loading from "@/components/common/Loading";
import ErrorState from "@/components/common/ErrorState";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";
import { useCart, useUI } from "@/store/store";
import CategoryPill from "@/components/CategoryPill";

type RestaurantWithMenu = Restaurant & { menu?: MenuItem[] };

function groupMenuByCategory(items: MenuItem[] | undefined): Record<string, MenuItem[]> {
  const grouped: Record<string, MenuItem[]> = {};
  if (!items || !items.length) return grouped;
  for (const item of items) {
    let category = "Featured";
    const name = item.name.toLowerCase();
    if (name.includes("salmon") || name.includes("shrimp") || name.includes("taco")) {
      category = "Seafood";
    } else if (name.includes("bbq") || name.includes("brisket") || name.includes("ribs")) {
      category = "Grill & BBQ";
    }
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  }
  return grouped;
}

/**
 * PUBLIC_INTERFACE
 * MenuItemCard - Renders a single menu item with add-to-cart controls.
 */
function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <Card className="h-full">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-gray-50">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">{item.name}</h4>
          {item.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</span>
            <Button size="sm" variant="secondary" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * PUBLIC_INTERFACE
 * AddToCartBar - Sticky footer bar summarizing cart for current restaurant, with CTA to view cart/checkout.
 */
function AddToCartBar({
  subtotal,
  quantity,
  restaurantName,
  onViewCart,
}: {
  subtotal: number;
  quantity: number;
  restaurantName: string | undefined;
  onViewCart?: () => void;
}) {
  if (quantity <= 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-white/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {quantity} {quantity === 1 ? "item" : "items"} in cart {restaurantName ? `• ${restaurantName}` : ""}
          </p>
          <p className="text-xs text-gray-600">Subtotal: {formatCurrency(subtotal)}</p>
        </div>
        <Button variant="primary" size="md" onClick={onViewCart} aria-label="View cart">
          View cart • {formatCurrency(subtotal)}
        </Button>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * RestaurantDetailClient - Client component for restaurant page content.
 */
export default function RestaurantDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [data, setData] = React.useState<RestaurantWithMenu | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const {
    cart,
    addItem,
    getTotalQuantity,
    getSubtotal,
    setRestaurant,
    clearCart,
  } = useCart();

  const { toastInfo } = useUI();

  const totalQty = getTotalQuantity();
  const subtotal = getSubtotal();

  React.useEffect(() => {
    if (!id) {
      notFound();
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);

    getRestaurantById(id)
      .then((res) => {
        if (!alive) return;
        if (!res?.id) {
          setError("Restaurant not found");
          return;
        }
        setData(res);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load restaurant");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const grouped = React.useMemo(() => groupMenuByCategory(data?.menu), [data?.menu]);
  const categories = React.useMemo(() => Object.keys(grouped), [grouped]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedCategory && categories.length) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const handleAdd = (item: MenuItem) => {
    if (!data) return;
    const incomingRestaurant = { id: data.id, name: data.name };

    const { replaced } = addItem({
      restaurantId: data.id,
      restaurantName: data.name,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      options: {},
    });

    if (replaced) {
      toastInfo?.(
        `Your cart has been updated for ${data.name}. Items from other restaurants were removed.`,
        "Cart updated"
      );
      setRestaurant(incomingRestaurant);
    } else if (!cart.restaurant || cart.restaurant?.id !== data.id) {
      setRestaurant(incomingRestaurant);
    }
  };

  const handleClearCartForRestaurantChange = () => {
    if (!data) return;
    clearCart();
    setRestaurant({ id: data.id, name: data.name });
  };

  if (loading) {
    return <Loading label="Loading restaurant" />;
  }
  if (error) {
    return <ErrorState title="Could not load restaurant" message={error} onRetry={() => location.reload()} />;
  }
  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="relative h-48 w-full bg-gradient-to-br from-blue-500/10 to-gray-50 sm:h-64">
          {data?.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={`${data?.name} hero`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{data?.name}</h1>
                <p className="mt-1 text-sm text-blue-50">
                  {data?.cuisine} • {data?.priceRange ?? "$$"} • {data?.deliveryTimeMin} min
                </p>
              </div>
              <div className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm">
                ⭐ {data?.rating?.toFixed?.(1) ?? "4.5"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 ? (
        <section aria-label="Menu categories" className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Menu</h2>
          <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
            {categories.map((c) => (
              <CategoryPill
                key={c}
                label={c}
                selected={selectedCategory === c}
                onClick={() => setSelectedCategory(c)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {categories.map((c) => (
            <div key={c} id={`cat-${c.replace(/\s+/g, "-").toLowerCase()}`}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{c}</h3>
                <span className="text-sm text-gray-500">{grouped[c].length} items</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {grouped[c].map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleAdd} />
                ))}
              </div>
            </div>
          ))}
          {categories.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
              No menu items available.
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card
            title="Your order"
            footer={
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
            }
          >
            {cart?.restaurant && cart.restaurant.id !== data?.id ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  You have items in your cart from <span className="font-medium">{cart.restaurant.name}</span>. Adding
                  from {data?.name} will replace your current cart.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCartForRestaurantChange}
                  aria-label="Clear cart and continue"
                >
                  Clear cart and continue
                </Button>
              </div>
            ) : totalQty > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  {totalQty} {totalQty === 1 ? "item" : "items"} in cart.
                </p>
                <Button variant="primary" size="md" fullWidth aria-label="Proceed to checkout">
                  Checkout
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Your cart is empty. Add some items from the menu.</p>
            )}
          </Card>
        </aside>
      </section>

      <AddToCartBar
        subtotal={subtotal}
        quantity={totalQty}
        restaurantName={data?.name}
        onViewCart={() => {
          const el = document.querySelector("aside");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
    </div>
  );
}
