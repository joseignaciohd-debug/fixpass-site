import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";
import { getCustomerBillingLookup, getCustomerPortalSnapshot } from "@/lib/repositories/customer-operations";
import { serviceRequestSchema } from "@/lib/validations/service-request";

export async function GET() {
  const snapshot = await getCustomerPortalSnapshot("cust_1");
  return NextResponse.json({
    data: snapshot?.requests ?? [],
    mode: snapshot?.source ?? "demo",
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = serviceRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      {
        mode: "demo",
        message: "Live request persistence is unavailable until Supabase server credentials are configured.",
      },
      { status: 503 },
    );
  }

  const client = createSupabaseServerClient();
  const session = await getDemoSession();
  const lookup = session ? await getCustomerBillingLookup(session.userId) : null;

  if (!client || !lookup) {
    return NextResponse.json(
      {
        error: "Customer context is unavailable.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await client
    .from("service_requests")
    .insert({
      customer_id: lookup.customerId,
      property_id: lookup.propertyId,
      subscription_id: lookup.subscriptionId,
      title: parsed.data.title,
      description: parsed.data.description,
      preferred_window: parsed.data.preferredWindow,
      area: parsed.data.area,
      internal_notes: parsed.data.notes || null,
      request_status: "pending",
      category: "covered",
      task_count: 1,
    })
    .select("id,title,description,request_status,preferred_window,area,created_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: "Could not persist service request.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      mode: "live",
      message: "Service request created successfully.",
      data,
    },
    { status: 201 },
  );
}
