import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeaveReviewForm from "@/components/reviews/LeaveReviewForm";
import TestimonialCard, { type Testimonial } from "@/components/reviews/TestimonialCard";

export const metadata: Metadata = {
  title: "Reviews",
  description: "See what customers are saying about Porch Light Flavor Co. — and leave your own review.",
};

// Always fresh so newly approved reviews show right away.
export const revalidate = 0;

async function getApproved(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id, name, location, rating, quote")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    return (data ?? []) as Testimonial[];
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getApproved();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Kind words
        </p>
        <h1
          className="text-5xl font-light text-[var(--color-brown)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Reviews
        </h1>
      </div>

      {reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {reviews.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2
            className="text-3xl font-light text-[var(--color-brown)] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Leave a review
          </h2>
          <p className="text-sm text-[var(--color-brown-muted)]">
            Ordered from us? We&apos;d love to hear how it went.
          </p>
        </div>
        <LeaveReviewForm />
      </div>
    </div>
  );
}
