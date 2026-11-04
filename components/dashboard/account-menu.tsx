"use client";

import Link from "next/link";
import { ChevronDown, Home, LogOut, Settings, UserRound, Users } from "lucide-react";

import { signOutAction } from "@/lib/auth/actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/** The top-bar account trigger + menu. Passed into the shell as a slot so it can stream in behind a Suspense boundary without holding up the chrome. */
/** Extra navigation available inside the account menu for privileged roles. */
export function AccountMenu({ name, subtitle, basePath, staffLink = false }: { name: string; subtitle: string; basePath: string; staffLink?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`${name} account menu`} className="flex items-center gap-2 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-ring sm:gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary"><UserRound className="size-4" aria-hidden /></span>
        <span className="hidden text-sm font-medium text-foreground lg:block">{name}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="border-b border-border px-3 py-2">
            <span className="block text-sm font-medium text-foreground">{name}</span>
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{subtitle}</span>
          </DropdownMenuLabel>
          <DropdownMenuItem render={<Link href="/" target="_blank" rel="noopener noreferrer" />} className="mt-1 py-1.5"><Home className="size-4" />Back to website</DropdownMenuItem>
          {staffLink && <DropdownMenuItem render={<Link href={`${basePath}/staff`} />} className="py-1.5"><Users className="size-4" />Staff</DropdownMenuItem>}
          <DropdownMenuItem render={<Link href={`${basePath}/settings`} />} className="py-1.5"><Settings className="size-4" />Settings</DropdownMenuItem>
          <form action={signOutAction}>
            <DropdownMenuItem render={<button type="submit" className="w-full" />} variant="destructive" className="py-1.5"><LogOut className="size-4" />Logout</DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Placeholder with the same box as the trigger, shown while the session resolves. */
export function AccountMenuFallback() {
  return (
    <div className="flex items-center gap-2 rounded-xl p-1 sm:gap-3" aria-hidden>
      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary"><UserRound className="size-4" /></span>
      <span className="hidden h-4 w-20 rounded-full bg-muted motion-safe:animate-pulse lg:block" />
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </div>
  );
}
