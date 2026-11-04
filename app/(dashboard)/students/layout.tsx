import { Suspense } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AccountMenu, AccountMenuFallback } from "@/components/dashboard/account-menu";
import type { DashboardNavItem } from "@/lib/dashboard";
import { RoleGate } from "@/lib/auth/gate";
import { requireRole } from "@/lib/auth/session";
import { pricingPlans } from "@/lib/pricing";
import Loading from "./loading";
import { ToastSlot } from "@/components/toast/toast-slot";

const dashboardLinks: readonly DashboardNavItem[] = [
  { slug: "dashboard", label: "Overview", icon: "overview", description: "Your learning journey, all in one place." },
  { slug: "classes", label: "Explore Classes", icon: "classes", description: "Find your lessons, stories and songs here." },
  { slug: "learning", label: "My Learning", icon: "learning", description: "Continue your classes and follow your progress." },
  { slug: "subscriptions", label: "Subscriptions", icon: "subscriptions", description: "Review your plan and available benefits." },
  { slug: "shop", label: "Shop", icon: "shop", description: "Explore books, bags and digital learning resources." },
  { slug: "saved", label: "Saved Items", icon: "saved", description: "A place for the classes and resources you want to revisit." },
  { slug: "orders", label: "My Orders", icon: "orders", description: "Keep your books, bags and digital purchases together." },
  { slug: "settings", label: "Settings", icon: "settings", description: "Manage your profile and preferences." },
];

// Async server component inside the top-bar slot: it reads the (per-request
// memoized) session, so it streams into the already-rendered chrome.
async function StudentAccount() {
  const { user } = await requireRole(["student"]);
  const plan = pricingPlans.find((item) => item.id === user.subscription);
  return <AccountMenu name={user.name} subtitle={plan ? `${plan.name} plan` : "Free plan"} basePath="/students" />;
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  // The sidebar and top bar are static chrome for this segment: the route's
  // folder decides the role, so the navigation never reads the session. Both
  // session consumers — the account menu and the gated page content — stream
  // in behind their own boundaries, so the chrome loads instantly.
  return (
    <DashboardShell
      navigationItems={dashboardLinks}
      basePath="/students"
      homePath="/students/dashboard"
      toast={<Suspense fallback={null}><ToastSlot /></Suspense>}
      account={
        <Suspense fallback={<AccountMenuFallback />}>
          <StudentAccount />
        </Suspense>
      }
    >
      <Suspense fallback={<Loading />}>
        <RoleGate allowed={["student"]}>
          {children}
        </RoleGate>
      </Suspense>
    </DashboardShell>
  );
}
