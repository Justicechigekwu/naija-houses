import {
  Ban,
  Building2,
  CircleHelp,
  Cookie,
  FileText,
  Gavel,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  Wallet,
} from "lucide-react-native";

export type HelpItem = {
  id: string;
  title: string;
  description: string;
  route: string;
  category: string;
  icon: React.ReactNode;
};

export const HELP_ITEMS: HelpItem[] = [
  {
    id: "about",
    title: "About Velora",
    description:
      "Learn what Velora is, how the marketplace works, and what users can buy, sell, or rent.",
    route: "/help/about",
    category: "GENERAL",
    icon: <Building2 size={18} color="#9C7A5B" />,
  },
  {
    id: "contact",
    title: "Contact Support",
    description:
      "Reach Velora support for account help, listing problems, payment concerns, reports, or appeals.",
    route: "/help/contact",
    category: "GENERAL",
    icon: <Mail size={18} color="#9C7A5B" />,
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    description:
      "Read the main rules that govern the use of Velora Marketplace and user responsibilities.",
    route: "/help/terms",
    category: "LEGAL",
    icon: <FileText size={18} color="#9C7A5B" />,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description:
      "See how Velora collects, uses, stores, and protects user information.",
    route: "/help/privacy",
    category: "LEGAL",
    icon: <Lock size={18} color="#9C7A5B" />,
  },
  {
    id: "user-agreement",
    title: "User Agreement",
    description:
      "Understand the agreement between Velora and every marketplace user.",
    route: "/help/user-agreement",
    category: "LEGAL",
    icon: <Gavel size={18} color="#9C7A5B" />,
  },
  {
    id: "community-guidelines",
    title: "Community Guidelines",
    description:
      "See the rules for respectful behavior, safe use, and honest marketplace activity.",
    route: "/help/community-guidelines",
    category: "MARKETPLACE RULES",
    icon: <ShieldCheck size={18} color="#9C7A5B" />,
  },
  {
    id: "prohibited-items",
    title: "Prohibited Items Policy",
    description:
      "See which items, services, and content are not allowed on Velora.",
    route: "/help/prohibited-items",
    category: "MARKETPLACE RULES",
    icon: <Ban size={18} color="#9C7A5B" />,
  },
  {
    id: "appeal-policy",
    title: "Appeal Policy",
    description:
      "Learn how listing removals or moderation decisions can be appealed.",
    route: "/help/appeal-policy",
    category: "MARKETPLACE RULES",
    icon: <Scale size={18} color="#9C7A5B" />,
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    description:
      "Understand how Velora may use cookies and similar technologies.",
    route: "/help/cookie-policy",
    category: "POLICIES",
    icon: <Cookie size={18} color="#9C7A5B" />,
  },
  {
    id: "refund-policy",
    title: "Refund Policy",
    description:
      "Read how refunds and transaction expectations are handled on the platform.",
    route: "/help/refund-policy",
    category: "POLICIES",
    icon: <Wallet size={18} color="#9C7A5B" />,
  },
  {
    id: "safety-tips",
    title: "Safety Tips",
    description:
      "Get tips for staying safe while buying, selling, chatting, and meeting users.",
    route: "/help/safety-tips",
    category: "HELP",
    icon: <CircleHelp size={18} color="#9C7A5B" />,
  },
];