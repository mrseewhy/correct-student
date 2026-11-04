import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  description,
  size = "md",
  footer,
  children,
}: {
  title: string;
  description?: string;
  size?: "md" | "signup" | "lg";
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", size === "md" ? "max-w-md" : size === "signup" ? "max-w-xl" : "max-w-2xl")}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-3 text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>

      {footer && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      )}
    </div>
  );
}
