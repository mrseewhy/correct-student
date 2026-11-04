import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Correct Student home"
      className={cn("inline-block", className)}
    >
      <Image
        src="/logo.png"
        alt="Correct Student"
        width={160}
        height={80}
        priority
        className="h-16 w-auto dark:hidden"
      />
      <Image
        src="/logo.png"
        alt=""
        aria-hidden
        width={160}
        height={80}
        priority
        className="hidden h-16 w-auto dark:block"
      />
    </Link>
  );
}
