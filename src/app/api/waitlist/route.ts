import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim();
    const name = String(body?.name ?? "").trim();

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Placeholder persistence point.
    // Connect Stripe/CRM/booking integrations here later.
    return NextResponse.json({ ok: true, message: "Captured" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
