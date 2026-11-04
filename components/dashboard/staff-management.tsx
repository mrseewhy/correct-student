"use client";

import { useActionState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/auth/field";
import {
  createStaffAdminAction,
  banStaffMemberAction,
  type StaffState,
} from "@/lib/auth/actions";
import { deleteUserAction } from "@/lib/data/actions/users-admin";
import { ActionConfirmationDialog } from "@/components/dashboard/action-confirmation-dialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { useActionToast } from "@/components/toast/use-action-toast";

const initialState: StaffState = { message: "", error: false };

export function StaffCreateForm() {
  const [state, formAction, pending] = useActionState(createStaffAdminAction, initialState);
  useActionToast(state);

  return (
    <form action={formAction} className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
      <div className="sm:col-span-2">
        <h2 className="font-heading text-base font-bold text-foreground">Add administrator</h2>
        <p className="mt-1 text-sm text-muted-foreground">Creates an account with the admin role. Only super admins can do this.</p>
      </div>
      <Field label="Full name" htmlFor="staff-name">
        <Input id="staff-name" name="name" required maxLength={100} placeholder="Their full name" className="h-11" />
      </Field>
      <Field label="Username" htmlFor="staff-username">
        <Input id="staff-username" name="username" required maxLength={30} placeholder="their.username" className="h-11" />
      </Field>
      <Field label="Email" htmlFor="staff-email">
        <Input id="staff-email" name="email" type="email" required maxLength={254} placeholder="staff@example.com" className="h-11" />
      </Field>
      <Field label="Password" htmlFor="staff-password">
        <Input id="staff-password" name="password" type="password" required minLength={8} maxLength={72} placeholder="At least 8 characters" className="h-11" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Role" htmlFor="staff-role">
          <select id="staff-role" name="role" defaultValue="admin" className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base md:text-sm">
            <option value="admin">Admin</option>
            <option value="super-admin">Super admin</option>
          </select>
        </Field>
      </div>
      <Button type="submit" variant="cta" className="sm:col-span-2" disabled={pending}>
        {pending ? "Adding…" : "Add administrator"}
      </Button>
    </form>
  );
}

export function StaffRowActions({
  userId,
  role,
  banned,
  isSelf,
  deleteAction,
}: {
  userId: string;
  role: "admin" | "super-admin";
  banned: boolean;
  isSelf: boolean;
  deleteAction: typeof deleteUserAction;
}) {
  const [banState, banFormAction, banPending] = useActionState(banStaffMemberAction, initialState);
  useActionToast(banState);

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        {/* Edit link — immediately before Ban */}
        <Link
          href={`/admin/staff/${userId}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-blue-500/50 bg-transparent px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50"
        >
          Edit
        </Link>
        {/* Ban/Unban confirmation modal */}
        {!isSelf && <ActionConfirmationDialog
          action={banFormAction}
          title={
            banned
              ? "Unban administrator?"
              : "Ban administrator?"
          }
          description={
            banned
              ? "Are you sure you want to unban this user? They will be able to sign in again."
              : "Are you sure you want to ban this user? They will not be able to sign in."
          }
          confirmLabel={banned ? "Unban" : "Ban"}
          confirmVariant={banned ? "default" : "destructive"}
          hiddenFields={{
            userId,
            ban: banned ? "false" : "true",
          }}
        >
          <span
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md border px-3 py-1 text-xs font-medium hover:bg-orange-50 hover:border-orange-500 focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-orange-500/20 pointer-events-none transition-colors ${
              banned
                ? "border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500 focus-visible:outline-emerald-500 focus-visible:ring-emerald-500/20"
                : "border-orange-500/50 text-orange-600 hover:border-orange-500 focus-visible:outline-orange-500 focus-visible:ring-orange-500/20"
            }`}
          >
            {banPending ? "Updating…" : banned ? "Unban" : "Ban"}
          </span>
        </ActionConfirmationDialog>}
        {!isSelf && <DeleteConfirmationDialog action={deleteAction} itemName={role} itemType="administrator" id={userId} />}
      </div>
    </div>
  );
}
