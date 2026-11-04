export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-linear-to-b from-secondary via-background to-background px-4 py-12 md:px-6 md:py-16">
      {children}
    </div>
  );
}
