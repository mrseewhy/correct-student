"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { pricingPlanSchema } from "@/validation/pricing-plans";
import { adminRecordId, guardAdminWrite, parseAdminFormInput } from "@/lib/data/actions/admin-input";
import {
  createPricingPlan,
  deletePricingPlan,
  updatePricingPlan,
} from "@/lib/data/dal/pricing-plans";

const LIST_PATH = "/admin/subscriptions";

const PRICING_TAG = "pricing-plans";

// Editing the catalog changes the public pricing page too. The page reads the
// plans through a `use cache` function tagged PRICING_TAG; every write drops
// that tag so the next visitor sees the updated catalog.
function invalidatePricing() {
  updateTag(PRICING_TAG);
  revalidatePath("/pricing");
}

export async function createPlanAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = parseAdminFormInput(pricingPlanSchema, {
    planKey: formData.get("plan_key"),
    name: formData.get("name"),
    description: formData.get("description"),
    priceNgn: formData.get("price_ngn"),
    priceUsd: formData.get("price_usd"),
    priceGbp: formData.get("price_gbp"),
    features: readFeatureLines(formData.get("features")),
    cta: formData.get("cta"),
    featured: formData.get("featured") === "on",
  }, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "subscription plan", () => createPricingPlan(parsed));
  invalidatePricing();
  revalidatePath(LIST_PATH);
}

export async function updatePlanAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  // Missing/id-mismatched ids fall back to the list page; parse failures return here.
  const parsed = parseAdminFormInput(pricingPlanSchema, {
    planKey: formData.get("plan_key"),
    name: formData.get("name"),
    description: formData.get("description"),
    priceNgn: formData.get("price_ngn"),
    priceUsd: formData.get("price_usd"),
    priceGbp: formData.get("price_gbp"),
    features: readFeatureLines(formData.get("features")),
    cta: formData.get("cta"),
    featured: formData.get("featured") === "on",
  }, `${LIST_PATH}/${id}`);
  await guardAdminWrite(`${LIST_PATH}/${id}`, "subscription plan", () => updatePricingPlan(id, parsed));
  invalidatePricing();
  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${id}`);
}

export async function deletePlanAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "subscription plan", () => deletePricingPlan(id));
  invalidatePricing();
  revalidatePath(LIST_PATH);
}

/** Reads the benefits textarea: one feature per non-empty line. */
function readFeatureLines(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}
