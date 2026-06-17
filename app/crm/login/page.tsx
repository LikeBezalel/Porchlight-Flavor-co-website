"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CRMLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/crm");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-dark)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-light text-[var(--color-brown)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Porch Light
          </h1>
          <p className="text-sm text-[var(--color-brown-muted)] mt-1">Order dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[var(--color-parchment)] p-8 space-y-5 shadow-sm"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--color-brown)]">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-parchment)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[var(--color-brown)]">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-parchment)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm hover:bg-[var(--color-brown-light)] disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
