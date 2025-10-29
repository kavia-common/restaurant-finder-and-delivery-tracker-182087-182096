import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Footer component providing site links and theme-consistent styling.
 * Contains basic navigation, copyright and subtle surface styling.
 */
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              OceanEats
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Browse restaurants, order your favorites, and track deliveries in
              real time.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Links</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="transition hover:text-blue-700">
                  About
                </Link>
              </li>
              <li>
                <Link href="/help" className="transition hover:text-blue-700">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/careers" className="transition hover:text-blue-700">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Legal</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/terms" className="transition hover:text-blue-700">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-blue-700">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition hover:text-blue-700">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} OceanEats. All rights reserved.</p>
          <p className="text-xs">
            Built with a modern Ocean Professional theme: blue & amber accents.
          </p>
        </div>
      </div>
    </footer>
  );
}
