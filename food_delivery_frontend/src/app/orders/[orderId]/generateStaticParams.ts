/**
 * PUBLIC_INTERFACE
 * generateStaticParams provides minimal params for static export compatibility.
 * For a real app, this would pre-generate known order IDs. Here we include a placeholder.
 */
export function generateStaticParams() {
  // Provide at least one placeholder param so Next.js can statically export the dynamic route scaffold.
  // The page is a client component and loads data client-side.
  return [{ orderId: "sample" }];
}

// Optional: provide minimal metadata generation to avoid any SSR assumptions if needed later.
export async function generateMetadata(_: { params: { orderId: string } }) {
  return {
    title: `Order ${_.params.orderId} • OceanEats`,
  };
}
