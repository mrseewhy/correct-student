import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Suspense } from "react";
import { ToastSlot } from "@/components/toast/toast-slot";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8"><Suspense fallback={null}><ToastSlot /></Suspense></div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
