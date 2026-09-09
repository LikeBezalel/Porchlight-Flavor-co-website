"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export type Review = {
  id: string;
  name: string;
  location: string | null;
  rating: number | null;
  quote: string;
  approved: boolean;
  created_at: string;
};

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <span className="text-[var(--color-gold)] text-sm">
      {"★".repeat(rating)}
      <span className="text-[var(--color-parchment)]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", location: "", rating: 0, quote: "" });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const pending = reviews.filter((r) => !r.approved);
  const published = reviews.filter((r) => r.approved);

  async function setApproved(review: Review, approved: boolean) {
    setError("");
    const { error } = await supabase
      .from("testimonials")
      .update({ approved })
      .eq("id", review.id);
    if (error) { setError(error.message); return; }
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, approved } : r)));
  }

  async function remove(review: Review) {
    if (!confirm(`Delete the review from ${review.name}? This can't be undone.`)) return;
    setError("");
    const { error } = await supabase.from("testimonials").delete().eq("id", review.id);
    if (error) { setError(error.message); return; }
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
  }

  async function addReview() {
    setError("");
    if (!draft.name.trim() || !draft.quote.trim()) {
      setError("Name and review text are required.");
      return;
    }
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: draft.name.trim(),
        location: draft.location.trim() || null,
        rating: draft.rating || null,
        quote: draft.quote.trim(),
        approved: true, // added by the owner → publish immediately
      })
      .select()
      .single();
    if (error) { setError(error.message); return; }
    setReviews((prev) => [data as Review, ...prev]);
    setDraft({ name: "", location: "", rating: 0, quote: "" });
    setAdding(false);
  }

  function Card({ r }: { r: Review }) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-parchment)] p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-semibold text-sm text-[var(--color-brown)]">{r.name}</span>
            {r.location && <span className="text-xs text-[var(--color-brown-muted)]"> · {r.location}</span>}
            <div className="mt-0.5"><Stars rating={r.rating} /></div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {r.approved ? (
              <button
                onClick={() => setApproved(r, false)}
                className="text-xs font-medium text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] px-3 py-1.5 rounded-full border border-[var(--color-parchment)] transition-colors"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={() => setApproved(r, true)}
                className="text-xs font-semibold text-white bg-[var(--color-gold)] hover:bg-[var(--color-brown-light)] px-3 py-1.5 rounded-full transition-colors"
              >
                Approve
              </button>
            )}
            <button
              onClick={() => remove(r)}
              className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-full border border-red-100 hover:border-red-300 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        <p className="text-sm text-[var(--color-brown-muted)] leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Pending */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-brown)] mb-3">
          Pending approval{pending.length > 0 && ` (${pending.length})`}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-[var(--color-brown-muted)]">Nothing waiting — new submissions will show up here.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => <Card key={r.id} r={r} />)}
          </div>
        )}
      </section>

      {/* Add manually */}
      <section>
        {adding ? (
          <div className="bg-white rounded-2xl border border-[var(--color-parchment)] p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Name *</label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Town (optional)</label>
                <input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Rating (optional)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDraft({ ...draft, rating: draft.rating === n ? 0 : n })}
                    className={`text-2xl leading-none ${draft.rating >= n ? "text-[var(--color-gold)]" : "text-[var(--color-parchment)]"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Review *</label>
              <textarea
                value={draft.quote}
                onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
                rows={3}
                className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => startTransition(() => { addReview(); })}
                disabled={isPending}
                className="px-5 py-2 rounded-full bg-[var(--color-gold)] text-white text-sm font-semibold hover:bg-[var(--color-brown-light)] transition-colors disabled:opacity-50"
              >
                {isPending ? "Adding…" : "Add & publish"}
              </button>
              <button
                onClick={() => { setAdding(false); setDraft({ name: "", location: "", rating: 0, quote: "" }); }}
                className="px-5 py-2 rounded-full border border-[var(--color-parchment)] text-sm font-semibold text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)] hover:text-[var(--color-brown-light)] transition-colors"
          >
            <span className="text-lg leading-none">+</span> Add a review yourself
          </button>
        )}
      </section>

      {/* Published */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-brown)] mb-3">
          Published{published.length > 0 && ` (${published.length})`}
        </h2>
        {published.length === 0 ? (
          <p className="text-sm text-[var(--color-brown-muted)]">No published reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {published.map((r) => <Card key={r.id} r={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
