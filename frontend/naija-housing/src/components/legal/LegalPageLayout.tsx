import { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: ReactNode;
  embedded?: boolean;
};

export default function LegalPageLayout({
  title,
  description,
  lastUpdated = "March 22, 2026",
  children,
  embedded = false,
}: LegalPageLayoutProps) {
  if (embedded) {
    return (
      <div className="text-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6">

          <h2 className="text-2xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h2>

          {description ? (
            <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
              {description}
            </p>
          ) : null}

          <p className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <article className="space-y-8 leading-8">{children}</article>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#0f1115] dark:text-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
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
        <article className="space-y-8 leading-8">{children}</article>
      </div>
    </main>
  );
}