import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, quote, location, rating } = body as {
    name?: string;
    quote?: string;
    location?: string;
    rating?: number;
  };

  if (!name?.toString().trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 422 });
  }
  if (!quote?.toString().trim()) {
    return NextResponse.json({ error: "Please write your review" }, { status: 422 });
  }

  let cleanRating: number | null = null;
  if (rating != null && rating !== 0) {
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 422 });
    }
    cleanRating = r;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("testimonials").insert({
    name: String(name).trim().slice(0, 120),
    quote: String(quote).trim().slice(0, 1500),
    location: location ? String(location).trim().slice(0, 120) : null,
    rating: cleanRating,
    approved: false, // held for the owner to approve in the CRM
  });

  if (error) {
    console.error("Supabase testimonial insert error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
