"use client";

import { useState, useEffect } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { STATUS_LABELS, ORDER_STATUSES } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

function formatDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value || value === "—") return null;
  return (
    <div className="py-3 border-b border-[var(--color-parchment)] last:border-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)] mb-0.5">
        {label}
      </p>
      <p className="text-sm text-[var(--color-brown)]">{value}</p>
    </div>
  );
}

export default function OrderDetail({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (updated: Order) => void;
}) {
  const [notes, setNotes] = useState(order.internal_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(order.internal_notes ?? "");
  }, [order.id, order.internal_notes]);

  async function saveNotes() {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ internal_notes: notes })
      .eq("id", order.id)
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      onUpdate(data as Order);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function changeStatus(status: OrderStatus) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id)
      .select()
      .single();
    if (!error && data) onUpdate(data as Order);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Order detail"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-[var(--color-warm-white)] h-full overflow-y-auto shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-parchment)] sticky top-0 bg-[var(--color-warm-white)] z-10">
          <div>
            <h2
              className="text-lg font-semibold text-[var(--color-brown)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {order.name}
            </h2>
            <p className="text-xs text-[var(--color-brown-muted)]">
              Submitted {formatDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] p-2 rounded-lg hover:bg-[var(--color-cream-dark)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2l14 14M16 2L2 16" />
            </svg>
          </button>
        </div>

        {/* Status selector */}
        <div className="px-6 py-4 border-b border-[var(--color-parchment)]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)] mb-2 block">
            Status
          </label>
          <select
            value={order.status}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-parchment)] text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Fields */}
        <div className="px-6 py-2 flex-1">
          <Row label="Email" value={<a href={`mailto:${order.email}`} className="underline">{order.email}</a>} />
          <Row label="Phone" value={<a href={`tel:${order.phone}`} className="underline">{order.phone}</a>} />
          <Row label="Interested in" value={order.interests?.join(", ")} />
          <Row label="Product details" value={order.product_details} />
          <Row label="Quantity" value={order.quantity} />
          <Row label="Desired date" value={formatDate(order.desired_date)} />
          <Row label="Fulfillment" value={order.fulfillment} />
          <Row label="Event type" value={order.event_type} />
          <Row label="Payment" value={order.payment_method} />
          <Row label="Notes" value={order.notes} />
        </div>

        {/* Internal notes */}
        <div className="px-6 py-4 border-t border-[var(--color-parchment)]">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)] mb-2 block">
            Internal notes
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private notes (not visible to customer)…"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-parchment)] text-sm text-[var(--color-brown)] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 placeholder:text-[var(--color-brown-muted)]/40"
          />
          <button
            onClick={saveNotes}
            disabled={saving}
            className="mt-2 px-5 py-2 rounded-full bg-[var(--color-gold)] text-white text-sm font-semibold hover:bg-[var(--color-brown-light)] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save notes"}
          </button>
        </div>
      </div>
    </div>
  );
}
