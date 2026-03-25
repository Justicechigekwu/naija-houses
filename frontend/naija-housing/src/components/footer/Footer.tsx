import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#8A715D] bg-white dark:border-gray-[#8A715D] dark:bg-[#8A715D]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">
              Velora Marketplace
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-200">
              Buy, sell, and connect with confidence. Velora helps users list
              products and services while maintaining marketplace safety and trust.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide dark:text-white">
              Legal
            </h4>
            <ul className="mt-3 space-y-2 text-sm  dark:text-gray-200">
              <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/user-agreement" className="hover:underline">User Agreement</Link></li>
              <li><Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:underline">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide  dark:text-white">
              Marketplace Rules
            </h4>
            <ul className="mt-3 space-y-2 text-sm  dark:text-gray-200">
              <li><Link href="/community-guidelines" className="hover:underline">Community Guidelines</Link></li>
              <li><Link href="/prohibited-items" className="hover:underline">Prohibited Items</Link></li>
              <li><Link href="/appeal-policy" className="hover:underline">Appeal Policy</Link></li>
              <li><Link href="/safety-tips" className="hover:underline">Safety Tips</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8  border-t pt-6 text-sm  text-center dark:border-gray-200 dark:text-gray-200">
          © 2026 Velora.com 
        </div>
      </div>
    </footer>
  );
}