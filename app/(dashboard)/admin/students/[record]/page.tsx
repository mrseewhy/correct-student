export const instant = false;

import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getUserById } from "@/lib/data/dal/users";
import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import {
  banUserAction,
  deleteUserAction,
  setUserPasswordAction,
  unbanUserAction,
  updateUserAction,
} from "@/lib/data/actions/users-admin";

export default async function Page({
  params,
}: {
  params: Promise<{ record: string }>;
}) {
  const { record } = await params;
  await requireRole(["admin", "super-admin"]);
  const user = await getUserById(record);
  if (!user || user.role !== "student") notFound();


  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/students" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Back to Students</Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Student</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{user.name}</h1>
          <p className="mt-3 text-muted-foreground">{user.email}</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-medium ${user.banned ? "bg-destructive/10 text-destructive" : "bg-secondary text-primary"}`}>{user.banned ? "Banned" : "Active"}</span>
      </div>


      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-6 py-5 text-xl">Details</h2>
        <dl className="divide-y divide-border">
          {[
            ["ID", user.id],
            ["Name", user.name],
            ["Email", user.email],
            ["Username", user.username],
            ["Role", user.role],
            ["Subscription", user.subscription],
            ["Banned", user.banned ? "Yes" : "No"],
            ["Ban reason", user.banReason ?? "—"],
            ["Joined", user.createdAt.toLocaleString()],
            ["Updated", user.updatedAt.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="break-words text-sm font-medium leading-6 text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl">Edit profile</h2>
        <form action={updateUserAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="targetRole" value="student" />
          <label className="text-sm">Name<input name="name" defaultValue={user.name} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" /></label>
          <label className="text-sm">Email<input name="email" type="email" defaultValue={user.email} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" /></label>
          <label className="text-sm">Username<input name="username" defaultValue={user.username} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" /></label>
          <label className="text-sm">Subscription
            <select name="subscription" defaultValue={user.subscription} className="mt-1 w-full h-11 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base md:text-sm">
              <option value="free">free</option>
              <option value="starter">starter</option>
              <option value="plus">plus</option>
              <option value="premium">premium</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Save changes</button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl">Password override</h2>
        <form action={setUserPasswordAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="targetRole" value="student" />
          <input name="newPassword" type="password" placeholder="New password (min 8 chars)" className="w-full rounded-md border border-border bg-background px-3 py-2 sm:max-w-sm" />
          <button type="submit" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">Set password</button>
        </form>
      </section>

      <section className="mt-8 flex flex-wrap gap-3">
        {user.banned ? (
          <form action={unbanUserAction}><input type="hidden" name="id" value={user.id} /><input type="hidden" name="targetRole" value="student" /><button type="submit" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">Unban user</button></form>
        ) : (
          <form action={banUserAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={user.id} />
            <input type="hidden" name="targetRole" value="student" />
            <input name="reason" placeholder="Ban reason" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button type="submit" className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">Ban user</button>
          </form>
        )}
        <DeleteConfirmationDialog action={deleteUserAction} itemName={user.name} itemType="student" id={user.id} />
      </section>
    </div>
  );
}
