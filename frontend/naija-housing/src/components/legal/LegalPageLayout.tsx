import Link from "next/link";
import { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  title,
  description,
  lastUpdated = "March 22, 2026",
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#0f1115] dark:text-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Legal / Policy
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          ) : null}

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-[#171a21]">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Related pages:{" "}
            <Link href="/privacy" className="font-medium underline underline-offset-4">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/user-agreement" className="font-medium underline underline-offset-4">
              User Agreement
            </Link>
            ,{" "}
            <Link href="/community-guidelines" className="font-medium underline underline-offset-4">
              Community Guidelines
            </Link>
            ,{" "}
            <Link href="/prohibited-items" className="font-medium underline underline-offset-4">
              Prohibited Items
            </Link>
            ,{" "}
            <Link href="/appeal-policy" className="font-medium underline underline-offset-4">
              Appeal Policy
            </Link>
          </p>
        </div>

        <article className="space-y-8 leading-8">{children}</article>
      </div>
    </main>
  );
}