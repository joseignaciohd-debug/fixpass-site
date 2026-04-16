"use server";

import { revalidatePath } from "next/cache";
import { requireDemoRole } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";

export async function updateTechnicianJobAction(formData: FormData) {
  await requireDemoRole("technician");

  if (!isSupabaseServerConfigured()) {
    return;
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return;
  }

  const requestId = String(formData.get("requestId") ?? "");
  const mode = String(formData.get("mode") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!requestId || !mode) {
    return;
  }

  const { data: assignment } = await client
    .from("technician_assignments")
    .select("id, technician_id, technicians(user_id)")
    .eq("service_request_id", requestId)
    .maybeSingle();

  if (!assignment?.id) {
    return;
  }

  if (mode === "check_in") {
    await client
      .from("technician_assignments")
      .update({ assignment_status: "checked_in", check_in_at: new Date().toISOString() })
      .eq("id", assignment.id);
    await client.from("service_requests").update({ request_status: "in progress" }).eq("id", requestId);
  }

  if (mode === "complete") {
    await client
      .from("technician_assignments")
      .update({ assignment_status: "complete", check_out_at: new Date().toISOString() })
      .eq("id", assignment.id);
    await client.from("service_requests").update({ request_status: "completed" }).eq("id", requestId);
  }

  if (mode === "quote") {
    await client.from("service_requests").update({ request_status: "quoted separately" }).eq("id", requestId);
  }

  const authorUserId = assignment.technicians?.[0]?.user_id ?? null;

  if (notes && authorUserId) {
    await client.from("notes").insert({
      author_user_id: authorUserId,
      service_request_id: requestId,
      body: notes,
      visibility: "internal",
    });
  }

  revalidatePath("/technician");
  revalidatePath(`/technician/jobs/${requestId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/admin/schedule");
}
