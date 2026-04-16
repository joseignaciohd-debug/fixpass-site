"use server";

import { revalidatePath } from "next/cache";
import { requireDemoRole } from "@/lib/auth";
import { getCustomerBillingLookup } from "@/lib/repositories/customer-operations";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";
import { serviceRequestSchema } from "@/lib/validations/service-request";

export async function createCustomerServiceRequestAction(formData: FormData) {
  const session = await requireDemoRole("customer");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  const lookup = await getCustomerBillingLookup(session.userId);
  if (!client || !lookup) {
    return;
  }

  const payload = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    preferredWindow: String(formData.get("preferredWindow") ?? ""),
    area: String(formData.get("area") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = serviceRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return;
  }

  const { error } = await client.from("service_requests").insert({
    customer_id: lookup.customerId,
    property_id: lookup.propertyId,
    subscription_id: lookup.subscriptionId,
    title: parsed.data.title,
    description: parsed.data.description,
    preferred_window: parsed.data.preferredWindow,
    area: parsed.data.area,
    internal_notes: parsed.data.notes || null,
    task_count: 1,
    category: "covered",
    request_status: "pending",
  });

  if (error) {
    return;
  }

  revalidatePath("/customer");
  revalidatePath("/customer/requests");
  revalidatePath("/admin");
  revalidatePath("/admin/requests");

}

export async function updateCustomerPropertyAction(formData: FormData) {
  const session = await requireDemoRole("customer");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  const lookup = await getCustomerBillingLookup(session.userId);
  if (!client || !lookup) {
    return;
  }

  const payload = {
    nickname: String(formData.get("nickname") ?? "").trim(),
    address_line_1: String(formData.get("addressLine1") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    postal_code: String(formData.get("postalCode") ?? "").trim(),
    home_type: String(formData.get("homeType") ?? "").trim() || null,
    access_notes: String(formData.get("accessNotes") ?? "").trim() || null,
  };

  if (!payload.nickname || !payload.address_line_1 || !payload.city || !payload.state || !payload.postal_code) {
    return;
  }

  const { error } = await client.from("properties").update(payload).eq("id", lookup.propertyId);
  if (error) {
    return;
  }

  revalidatePath("/customer");
  revalidatePath("/customer/property");
  revalidatePath("/admin");
  revalidatePath("/admin/requests");

}
