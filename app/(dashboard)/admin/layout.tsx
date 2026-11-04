import { Suspense } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AccountMenu, AccountMenuFallback } from "@/components/dashboard/account-menu";
import type { DashboardNavItem } from "@/lib/dashboard";
import { RoleGate } from "@/lib/auth/gate";
import { requireRole } from "@/lib/auth/session";
import Loading from "./loading";
import { ToastSlot } from "@/components/toast/toast-slot";

const baseLinks: readonly DashboardNavItem[] = [
  { slug: "dashboard", label: "Overview", icon: "overview", description: "Platform activity at a glance." },
  { slug: "newsletter", label: "Newsletter", icon: "newsletter", description: "View subscribers and signup history." },
  { slug: "contact", label: "Contact", icon: "contact", description: "Review messages and follow-ups." },
  { slug: "media", label: "Media", icon: "media", description: "Manage uploaded media files." },
  { slug: "students", label: "Students", icon: "students", description: "Review learner profiles and plans." },
  { slug: "tutors", label: "Tutors", icon: "tutors", description: "Review teachers and their classes." },
  { slug: "staff", label: "Admins", icon: "users", description: "Manage administrator accounts." },
  { slug: "languages", label: "Languages", icon: "languages", description: "Manage the languages available to learners." },
  { slug: "content-types", label: "Content Type", icon: "content-types", description: "Manage class delivery methods: lessons, stories, songs." },
  { slug: "media-types", label: "Media Type", icon: "media-types", description: "Manage media formats: video, text, audio." },
  { slug: "levels", label: "Levels", icon: "levels", description: "Manage learning levels: beginners, intermediate, advanced." },
  { slug: "subscriptions", label: "Subscriptions", icon: "subscriptions", description: "Review plans and member subscriptions." },
  { slug: "classes", label: "Classes", icon: "classes", description: "Manage lessons, stories and songs." },
  { slug: "blog", label: "Blog", icon: "blog", description: "Manage articles and editorial content." },
  { slug: "products", label: "Products", icon: "products", description: "Manage physical and digital products." },
  { slug: "orders", label: "Orders", icon: "orders", description: "Track purchases and fulfillment." },
  { slug: "coupons", label: "Coupons", icon: "coupons", description: "Manage discounts and redemption limits." },
  { slug: "activities", label: "Activities", icon: "activities", description: "Follow recent platform changes." },
  { slug: "settings", label: "Settings", icon: "settings", description: "Manage platform preferences." },
];

// Async server component inside the top-bar slot: it reads the (per-request
// memoized) session, so it streams into the already-rendered chrome.
async function AdminAccount() {
  const { user } = await requireRole(["admin", "super-admin"]);
  return (
    <AccountMenu
      name={user.name}
      subtitle={user.role === "super-admin" ? "Super admin" : "Administrator"}
      basePath="/admin"
      // Only super-admin manages staff, so the link waits for the session:
      // the sidebar must render instantly today, and /admin/staff enforces
      // super-admin on its own page regardless of what the menu shows.
      staffLink={user.role === "super-admin"}
    />
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The sidebar and top bar are static chrome for this segment: the route's
  // folder decides the role, so the navigation never reads the session. Both
  // session consumers — the account menu and the gated page content — stream
  // in behind their own boundaries, so the chrome loads instantly.
  return (
    <DashboardShell
      navigationItems={baseLinks}
      basePath="/admin"
      homePath="/admin/dashboard"
      toast={<Suspense fallback={null}><ToastSlot /></Suspense>}
      account={
        <Suspense fallback={<AccountMenuFallback />}>
          <AdminAccount />
        </Suspense>
      }
    >
      <Suspense fallback={<Loading />}>
        <RoleGate allowed={["admin", "super-admin"]}>
          {children}
        </RoleGate>
      </Suspense>
    </DashboardShell>
  );
}
