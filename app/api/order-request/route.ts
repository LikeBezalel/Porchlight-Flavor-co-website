import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderNotification } from "@/lib/email";

// Validation helpers
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isValidPhone(v: string) {
  return /^[\d\s\-().+]{7,}$/.test(v);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, interests } = body as {
    name?: string;
    email?: string;
    phone?: string;
    interests?: string[];
  };

  if (!name?.toString().trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (!email?.toString().trim() || !isValidEmail(email.toString())) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 422 });
  }
  if (!phone?.toString().trim() || !isValidPhone(phone.toString())) {
    return NextResponse.json({ error: "Valid phone is required" }, { status: 422 });
  }
  if (!Array.isArray(interests) || interests.length === 0) {
    return NextResponse.json({ error: "At least one interest is required" }, { status: 422 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const payload = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    interests: interests.map(String),
    product_details: body.product_details ? String(body.product_details).trim() : null,
    quantity: body.quantity ? String(body.quantity).trim() : null,
    desired_date: body.desired_date ? String(body.desired_date) : null,
    fulfillment: body.fulfillment ? String(body.fulfillment) : null,
    event_type: body.event_type ? String(body.event_type) : null,
    notes: body.notes ? String(body.notes).trim() : null,
    payment_method: body.payment_method ? String(body.payment_method) : null,
    status: "new_request",
  };

  const { error } = await supabase.from("orders").insert(payload);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to save order request" }, { status: 500 });
  }

  // Notify the owner. Never let an email failure block a successful order.
  try {
    await sendOrderNotification(payload);
  } catch (err) {
    console.error("Order notification email failed:", err);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
