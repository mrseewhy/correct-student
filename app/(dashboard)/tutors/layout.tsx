import { Suspense } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AccountMenu, AccountMenuFallback } from "@/components/dashboard/account-menu";
import type { DashboardNavItem } from "@/lib/dashboard";
import { RoleGate } from "@/lib/auth/gate";
import { requireRole } from "@/lib/auth/session";
import Loading from "./loading";
import { ToastSlot } from "@/components/toast/toast-slot";

const tutorLinks: readonly DashboardNavItem[] = [
  { slug: "dashboard", label: "Overview", icon: "overview", description: "Your teaching workspace." },
  { slug: "classes", label: "My Classes", icon: "classes", description: "Manage your classes and lessons." },
  { slug: "students", label: "Students", icon: "users", description: "View your learners." },
  { slug: "schedule", label: "Schedule", icon: "schedule", description: "View your upcoming classes and availability." },
  { slug: "assignments", label: "Assignments & Feedback", icon: "assignments", description: "Review learner work and feedback." },
  { slug: "messages", label: "Messages", icon: "messages", description: "View conversations with learners." },
  { slug: "resources", label: "Resources", icon: "resources", description: "Teaching materials and class resources." },
  { slug: "settings", label: "Settings", icon: "settings", description: "Manage your profile and preferences." },
];

// Async server component inside the top-bar slot: it reads the (per-request
// memoized) session, so it streams into the already-rendered chrome.
async function TutorAccount() {
  const { user } = await requireRole(["tutor"]);
  return <AccountMenu name={user.name} subtitle="Tutor" basePath="/tutors" />;
}

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  // The sidebar and top bar are static chrome for this segment: the route's
  // folder decides the role, so the navigation never reads the session. Both
  // session consumers — the account menu and the gated page content — stream
  // in behind their own boundaries, so the chrome loads instantly.
  return (
    <DashboardShell
      navigationItems={tutorLinks}
      basePath="/tutors"
      homePath="/tutors/dashboard"
      toast={<Suspense fallback={null}><ToastSlot /></Suspense>}
      account={
        <Suspense fallback={<AccountMenuFallback />}>
          <TutorAccount />
        </Suspense>
      }
    >
      <Suspense fallback={<Loading />}>
        <RoleGate allowed={["tutor"]}>
          {children}
        </RoleGate>
      </Suspense>
    </DashboardShell>
  );
}
