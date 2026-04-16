import { NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim();
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const city = String(body?.city ?? "").trim();
    const addressLine1 = String(body?.addressLine1 ?? "").trim();
    const details = String(body?.details ?? "").trim();

    if (!email || !name || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isSupabaseServerConfigured()) {
      const client = createSupabaseServerClient();

      if (!client) {
        return NextResponse.json({ error: "Supabase server client unavailable" }, { status: 500 });
      }

      const { error } = await client.from("waitlist_leads").insert({
        full_name: name,
        email,
        phone: phone || null,
        city: city || null,
        address_line_1: addressLine1 || null,
        details,
        source: "website",
      });

      if (error) {
        return NextResponse.json({ error: "Could not save request" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, message: "Captured" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
