"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function LeaveReviewForm() {
  const [form, setForm] = useState({ name: "", location: "", rating: 0, quote: "" });
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", location: "", rating: 0, quote: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[var(--color-gold-pale)] rounded-2xl p-8 text-center">
        <p
          className="text-2xl font-light text-[var(--color-brown)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Thank you! 🤍
        </p>
        <p className="text-[var(--color-brown-muted)] text-sm max-w-sm mx-auto">
          Your review was submitted and will appear once we&apos;ve had a chance to look it over.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-[var(--color-gold)] hover:text-[var(--color-brown-light)] underline underline-offset-4"
        >
          Leave another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-[var(--color-warm-white)] border border-[var(--color-parchment)] rounded-2xl p-6 sm:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Your name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Town (optional)</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Prescott Valley"
            className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1.5">Rating (optional)</label>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => setForm({ ...form, rating: form.rating === n ? 0 : n })}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={`text-2xl leading-none transition-colors ${
                (hover || form.rating) >= n ? "text-[var(--color-gold)]" : "text-[var(--color-parchment)]"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Your review *</label>
        <textarea
          required
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          rows={4}
          placeholder="Tell us what you loved…"
          className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)] resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm hover:bg-[var(--color-brown-light)] disabled:opacity-60 transition-colors"
      >
        {status === "loading" ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
