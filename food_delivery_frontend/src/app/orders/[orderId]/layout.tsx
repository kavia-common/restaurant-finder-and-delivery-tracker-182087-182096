export { generateStaticParams } from "./generateStaticParams";

// PUBLIC_INTERFACE
export default function OrdersOrderIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /** Wrapper layout required to ensure segment-level server context;
   *  It does not render anything special, only passes children through.
   */
  return children as React.ReactElement;
}
