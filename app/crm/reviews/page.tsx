import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CRMHeader from "@/components/crm/CRMHeader";
import ReviewsManager, { type Review } from "@/components/crm/reviews/ReviewsManager";

export const revalidate = 0;

export default async function CRMReviewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/crm/login");

  const { data: reviews } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">
      <CRMHeader userEmail={user.email ?? ""} />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-light text-[var(--color-brown)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reviews
          </h1>
          <p className="text-sm text-[var(--color-brown-muted)] mt-1">
            Approve reviews before they appear on the site, or add ones customers sent you directly.
          </p>
        </div>
        <ReviewsManager initialReviews={(reviews ?? []) as Review[]} />
      </div>
    </div>
  );
}
