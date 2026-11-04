// Sidebar navigation metadata and shared types; each dashboard layout defines its own links.
export const adminPages = [
  { slug: "dashboard", label: "Overview", description: "Platform activity at a glance." },
  { slug: "newsletter", label: "Newsletter", description: "View subscribers and signup history." },
  { slug: "contact", label: "Contact", description: "Review messages and follow-ups." },
  { slug: "languages", label: "Languages", description: "Manage the languages available to learners." },
  { slug: "subscriptions", label: "Subscriptions", description: "Review plans and member subscriptions." },
  { slug: "students", label: "Students", description: "Review learner profiles and plans." },
  { slug: "tutors", label: "Tutors", description: "Review teachers and their classes." },
  { slug: "classes", label: "Classes", description: "Manage lessons, stories and songs." },
  { slug: "blog", label: "Blog", description: "Manage articles and editorial content." },
  { slug: "products", label: "Products", description: "Manage physical and digital products." },
  { slug: "orders", label: "Orders", description: "Track purchases and fulfillment." },
  { slug: "coupons", label: "Coupons", description: "Manage discounts and redemption limits." },
  { slug: "activities", label: "Activities", description: "Follow recent platform changes." },
  { slug: "settings", label: "Settings", description: "Manage platform preferences." },
] as const;

export type DashboardNavItem = {
  slug: string;
  label: string;
  icon: "overview" | "classes" | "learning" | "shop" | "saved" | "orders" | "settings" | "languages" | "users" | "blog" | "newsletter" | "contact" | "subscriptions" | "students" | "tutors" | "products" | "coupons" | "activities" | "schedule" | "assignments" | "messages" | "resources" | "content-types" | "media-types" | "levels" | "media";
  description: string;
};
