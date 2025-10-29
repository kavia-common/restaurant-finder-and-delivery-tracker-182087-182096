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
import MenuItemCard from "@/components/MenuItemCard";
import AddToCartBar from "@/components/AddToCartBar";

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
