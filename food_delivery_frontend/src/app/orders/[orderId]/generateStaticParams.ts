export async function generateStaticParams(): Promise<Array<{ orderId: string }>> {
  /**
   * PUBLIC_INTERFACE
   * generateStaticParams - required for Next.js `output: export` when using dynamic routes.
   * We return an empty array to avoid pre-building unknown order IDs while allowing the app
   * to function with client-side navigation and fetching.
   */
  return [];
}
