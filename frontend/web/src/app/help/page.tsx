"use client";

import { useMemo, useState } from "react";
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
  ArrowLeft,
} from "lucide-react";

import AppealPolicyContent from "@/components/help-content/AppealPolicyContent";
import TermsContent from "@/components/help-content/TermsContent";
import PrivacyContent from "@/components/help-content/PrivacyContent";
import UserAgreementContent from "@/components/help-content/UserAgreementContent";
import CommunityGuidelinesContent from "@/components/help-content/CommunityGuidelinesContent";
import ProhibitedItemsContent from "@/components/help-content/ProhibitedItemsContent";
import CookiePolicyContent from "@/components/help-content/CookiePolicyContent";
import RefundPolicyContent from "@/components/help-content/RefundPolicyContent";
import SafetyTipsContent from "@/components/help-content/SafetyTipsContent";
import AboutContent from "@/components/help-content/AboutContent";
import ContactContent from "@/components/help-content/ContactContent";

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

function renderSelectedContent(selectedId: string) {
  switch (selectedId) {
    case "about":
      return <AboutContent embedded/>;
    case "support":
      return <ContactContent embedded />;
    case "terms":
      return <TermsContent embedded />;
    case "privacy":
      return <PrivacyContent embedded />;
    case "user-agreement":
      return <UserAgreementContent embedded />;
    case "community-guidelines":
      return <CommunityGuidelinesContent embedded />;
    case "prohibited-items":
      return <ProhibitedItemsContent embedded />;
    case "appeal-policy":
      return <AppealPolicyContent embedded />;
    case "cookie-policy":
      return <CookiePolicyContent embedded />;
    case "refund-policy":
      return <RefundPolicyContent embedded />;
    case "safety-tips":
      return <SafetyTipsContent embedded />;
    default:
      return <AboutContent />;
  }
}

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("about");
  const [mobileView, setMobileView] = useState<"list" | "details">("list");

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

  const groupedItems = useMemo(() => {
    const groups: Record<string, HelpItem[]> = {};

    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  const selectedItem =
    HELP_ITEMS.find((item) => item.id === selectedId) || HELP_ITEMS[0];

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setMobileView("details");
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 sm:text-2xl">
            Help, Policies & About Velora
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Find everything about Velora, including legal pages, marketplace
            rules, safety, support, and platform information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] items-start">
          <aside
            className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${
              mobileView === "details" ? "hidden lg:block" : "block"
            }`}
          >
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
                          onClick={() => handleSelectItem(item.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                            active
                              ? "bg-[#EEF5EF] text-[#8A715D]"
                              : "bg-white text-gray-800 hover:bg-gray-50"
                          } ${
                            index !== items.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <span
                            className={
                              active ? "text-[#8A715D]" : "text-gray-500"
                            }
                          >
                            {item.icon}
                          </span>
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
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

          <section
            className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${
              mobileView === "list" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="border-b border-gray-200 px-4 py-3 lg:hidden">
              <button
                type="button"
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <div id={selectedItem.id}>{renderSelectedContent(selectedId)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}