"use server";

import { revalidatePath } from "next/cache";
import { requireDemoRole } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";

export async function updateAdminRequestAction(formData: FormData) {
  await requireDemoRole("admin");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return;
  }

  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");
  const technicianId = String(formData.get("technicianId") ?? "");
  const scheduledFor = String(formData.get("scheduledFor") ?? "");
  const category = String(formData.get("category") ?? "");
  const internalNotes = String(formData.get("internalNotes") ?? "").trim();

  if (!requestId) {
    return;
  }

  const updatePayload: Record<string, string | null> = {};

  if (status) {
    updatePayload.request_status = status;
  }

  if (scheduledFor) {
    updatePayload.scheduled_for = new Date(scheduledFor).toISOString();
  }

  if (category) {
    updatePayload.category = category;
  }

  updatePayload.internal_notes = internalNotes || null;

  if (Object.keys(updatePayload).length) {
    await client.from("service_requests").update(updatePayload).eq("id", requestId);
  }

  if (technicianId && technicianId !== "unassigned") {
    const { data: existingAssignment } = await client
      .from("technician_assignments")
      .select("id")
      .eq("service_request_id", requestId)
      .maybeSingle();

    if (existingAssignment?.id) {
      await client
        .from("technician_assignments")
        .update({ technician_id: technicianId, assignment_status: "assigned" })
        .eq("id", existingAssignment.id);
    } else {
      await client.from("technician_assignments").insert({
        service_request_id: requestId,
        technician_id: technicianId,
        assignment_status: "assigned",
      });
    }

    await client.from("service_requests").update({ request_status: "technician assigned" }).eq("id", requestId);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/schedule");
  revalidatePath("/technician");
}

export async function updateAdminQuoteAction(formData: FormData) {
  await requireDemoRole("admin");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return;
  }

  const quoteId = String(formData.get("quoteId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!quoteId || !status) {
    return;
  }

  await client.from("quotes").update({ status }).eq("id", quoteId);

  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
}

export async function updateAdminPlanAction(formData: FormData) {
  await requireDemoRole("admin");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return;
  }

  const planId = String(formData.get("planId") ?? "");
  if (!planId) {
    return;
  }

  const monthlyPrice = Number(formData.get("monthlyPrice") ?? 0);
  const annualRaw = String(formData.get("annualPrice") ?? "").trim();
  const discount = Number(formData.get("discountPercent") ?? 0);
  const schedulingPriority = Number(formData.get("schedulingPriority") ?? 1);
  const status = String(formData.get("status") ?? "active");

  await client
    .from("membership_plans")
    .update({
      monthly_price: monthlyPrice,
      annual_price: annualRaw ? Number(annualRaw) : null,
      out_of_scope_discount_percent: discount,
      scheduling_priority: schedulingPriority,
      status,
    })
    .eq("id", planId);

  revalidatePath("/admin");
  revalidatePath("/admin/plans");
}

export async function updateAdminServiceRulesAction(formData: FormData) {
  await requireDemoRole("admin");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return;
  }

  await client
    .from("settings")
    .upsert(
      {
        key: "service_rules",
        value: {
          one_registered_property_per_membership: formData.get("oneRegisteredPropertyPerMembership") === "on",
          response_sla_hours: Number(formData.get("responseSlaHours") ?? 24),
          covered_visit_target_business_days: String(formData.get("coveredVisitTargetBusinessDays") ?? "1-3"),
          schedule_depends_on_availability: formData.get("scheduleDependsOnAvailability") === "on",
          excluded_work_quote_or_decline: formData.get("excludedWorkQuoteOrDecline") === "on",
        },
      },
      { onConflict: "key" },
    );

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
