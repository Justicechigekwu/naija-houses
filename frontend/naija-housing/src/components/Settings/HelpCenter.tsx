"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Lock,
  Gavel,
  Ban,
  Scale,
  Cookie,
  Wallet,
  CircleHelp,
  Building2,
  MessageCircle,
  Search,
} from "lucide-react";

type HelpItem = {
  id: string;
  title: string;
  href: string;
  description: string;
  category: string;
  icon: React.ReactNode;
};

const HELP_ITEMS: HelpItem[] = [
  {
    id: "about",
    title: "About Velora",
    href: "/about",
    category: "GENERAL",
    description:
      "Learn what Velora is, how the marketplace works, and what users can buy, sell, or rent.",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: "support",
    title: "Contact Support",
    href: "/contact",
    category: "GENERAL",
    description:
      "Reach Velora support for account help, listing problems, payment concerns, reports, or appeals.",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    href: "/terms",
    category: "LEGAL",
    description:
      "Read the main rules that govern the use of Velora Marketplace and user responsibilities.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    href: "/privacy",
    category: "LEGAL",
    description:
      "See how Velora collects, uses, stores, and protects user information.",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    id: "user-agreement",
    title: "User Agreement",
    href: "/user-agreement",
    category: "LEGAL",
    description:
      "Understand the agreement between Velora and every marketplace user.",
    icon: <Gavel className="h-5 w-5" />,
  },
  {
    id: "community-guidelines",
    title: "Community Guidelines",
    href: "/community-guidelines",
    category: "MARKETPLACE RULES",
    description:
      "See the rules for respectful behavior, safe use, and honest marketplace activity.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "prohibited-items",
    title: "Prohibited Items Policy",
    href: "/prohibited-items",
    category: "MARKETPLACE RULES",
    description:
      "See which items, services, and content are not allowed on Velora.",
    icon: <Ban className="h-5 w-5" />,
  },
  {
    id: "appeal-policy",
    title: "Appeal Policy",
    href: "/appeal-policy",
    category: "MARKETPLACE RULES",
    description:
      "Learn how listing removals or moderation decisions can be appealed.",
    icon: <Scale className="h-5 w-5" />,
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    href: "/cookie-policy",
    category: "POLICIES",
    description:
      "Understand how Velora may use cookies and similar technologies.",
    icon: <Cookie className="h-5 w-5" />,
  },
  {
    id: "refund-policy",
    title: "Refund Policy",
    href: "/refund-policy",
    category: "POLICIES",
    description:
      "Read how refunds and transaction expectations are handled on the platform.",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    id: "safety-tips",
    title: "Safety Tips",
    href: "/safety-tips",
    category: "HELP",
    description:
      "Get tips for staying safe while buying, selling, chatting, and meeting users.",
    icon: <CircleHelp className="h-5 w-5" />,
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("about");

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return HELP_ITEMS;

    return HELP_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedItem =
    HELP_ITEMS.find((item) => item.id === selectedId) || HELP_ITEMS[0];

  const groupedItems = useMemo(() => {
    const groups: Record<string, HelpItem[]> = {};

    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Help, Policies & About Velora
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Find everything about Velora, including legal pages, marketplace
            rules, safety, support, and platform information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* LEFT PANEL */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies, help, about..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8A715D] focus:bg-white"
              />
            </div>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
              {Object.entries(groupedItems).map(([group, items]) => (
                <div key={group}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {group}
                  </p>

                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    {items.map((item, index) => {
                      const active = selectedId === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                            active
                              ? "bg-[#EEF5EF] text-[#2C6B3F]"
                              : "bg-white text-gray-800 hover:bg-gray-50"
                          } ${index !== items.length - 1 ? "border-b border-gray-200" : ""}`}
                        >
                          <span className={active ? "text-[#2C6B3F]" : "text-gray-500"}>
                            {item.icon}
                          </span>
                          <span className="text-sm font-medium">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  No result found for your search.
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#EEF5EF] p-2 text-[#2C6B3F]">
                  {selectedItem.icon}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {selectedItem.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedItem.category}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <p className="max-w-3xl text-sm leading-7 text-gray-700 sm:text-base">
                {selectedItem.description}
              </p>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 sm:p-5">
                {selectedItem.id === "about" && (
                  <div className="space-y-3 text-sm leading-7 text-gray-700 sm:text-base">
                    <p>
                      Velora is a digital marketplace where users can buy, sell,
                      rent, and connect across different categories.
                    </p>
                    <p>
                      Our goal is to create a marketplace that is simple,
                      trustworthy, and safe for both buyers and sellers.
                    </p>
                    <p>
                      Velora may also review listings, reports, payments, and
                      appeals to help maintain marketplace quality and trust.
                    </p>
                  </div>
                )}

                {selectedItem.id === "support" && (
                  <div className="space-y-3 text-sm leading-7 text-gray-700 sm:text-base">
                    <p>
                      You can contact Velora support for listing issues, account
                      help, reports, moderation questions, payment concerns, and
                      general assistance.
                    </p>
                    <p>
                      For best results, provide full details of the issue so the
                      support team can help faster.
                    </p>
                  </div>
                )}

                {!["about", "support"].includes(selectedItem.id) && (
                  <div className="space-y-3 text-sm leading-7 text-gray-700 sm:text-base">
                    <p>
                      Open this page to read the full document and understand how
                      it applies to your use of Velora Marketplace.
                    </p>
                    <p>
                      These pages are important for account use, listing rules,
                      moderation, safety, privacy, and marketplace behavior.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href={selectedItem.href}
                  className="inline-flex items-center rounded-xl bg-[#8A715D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7A6352]"
                >
                  Open {selectedItem.title}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}