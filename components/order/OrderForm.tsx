"use client";

import { useState, useEffect } from "react";
import type { OrderFormData } from "@/lib/types";

const INTEREST_OPTIONS = [
  "Muffins",
  "Cake Slices",
  "Bread Loaves",
  "Brownies",
  "Crispies",
  "Cookies",
  "Catering",
  "Wholesale",
  "Other",
];

const EVENT_TYPES = [
  "Personal order",
  "Café/Coffee Shop",
  "Office",
  "Church/Ministry",
  "Party/Event",
  "Other",
];

const PAYMENT_OPTIONS = ["Apple Pay", "Zelle", "Cash App", "Cash", "Not sure yet"];
const FULFILLMENT_OPTIONS = ["Pickup", "Delivery", "Not sure yet"];

const empty: OrderFormData = {
  name: "",
  email: "",
  phone: "",
  interests: [],
  product_details: "",
  quantity: "",
  desired_date: "",
  fulfillment: "",
  event_type: "",
  notes: "",
  payment_method: "",
};

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[var(--color-brown)]">
        {label}
        {required && <span className="text-[var(--color-gold)] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--color-parchment)] bg-white text-[var(--color-brown)] text-sm placeholder:text-[var(--color-brown-muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] transition";

export default function OrderForm({ defaultWholesale = false }: { defaultWholesale?: boolean }) {
  const [form, setForm] = useState<OrderFormData>({
    ...empty,
    interests: defaultWholesale ? ["Wholesale"] : [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (defaultWholesale && !form.interests.includes("Wholesale")) {
      setForm((f) => ({ ...f, interests: [...f.interests, "Wholesale"] }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultWholesale]);

  function validate(): boolean {
    const e: Partial<Record<keyof OrderFormData, string>> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone is required.";
    } else if (!/^[\d\s\-().+]{7,}$/.test(form.phone)) {
      e.phone = "Please enter a valid phone number.";
    }
    if (form.interests.length === 0) {
      e.interests = "Please select at least one interest.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function toggle(interest: string) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/order-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-[var(--color-gold-pale)] border border-[var(--color-parchment)] p-10 text-center">
        <div className="text-4xl mb-4" aria-hidden>🕯️</div>
        <h2
          className="text-2xl font-semibold text-[var(--color-brown)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Request received!
        </h2>
        <p className="text-[var(--color-brown-muted)] leading-relaxed max-w-md mx-auto">
          Thank you! Your request has been sent. We'll follow up soon to confirm
          availability, pricing, and pickup or delivery details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Contact */}
      <fieldset className="space-y-4">
        <legend
          className="text-base font-semibold text-[var(--color-brown)] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your contact info
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" required error={errors.name}>
            <input
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="(928) 555-0100"
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
      </fieldset>

      {/* Interests */}
      <fieldset>
        <legend
          className="text-base font-semibold text-[var(--color-brown)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What are you interested in?
          <span className="text-[var(--color-gold)] ml-0.5">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              aria-pressed={form.interests.includes(opt)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                form.interests.includes(opt)
                  ? "bg-[var(--color-gold)] border-[var(--color-gold)] text-white"
                  : "bg-white border-[var(--color-parchment)] text-[var(--color-brown-muted)] hover:border-[var(--color-gold)]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {errors.interests && (
          <p className="text-xs text-red-600 mt-1.5">{errors.interests}</p>
        )}
      </fieldset>

      {/* Order details */}
      <fieldset className="space-y-4">
        <legend
          className="text-base font-semibold text-[var(--color-brown)] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Order details
        </legend>
        <Field label="Product / flavor details">
          <textarea
            rows={3}
            placeholder="Which flavors? Any special requests? (e.g. 6 Blueberry Morning Crumble + 6 Chocolate Hearth)"
            className={inputClass + " resize-none"}
            value={form.product_details}
            onChange={(e) => setForm({ ...form, product_details: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Quantity">
            <input
              type="text"
              placeholder="e.g. 12 muffins, 2 loaves"
              className={inputClass}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </Field>
          <Field label="Desired date">
            <input
              type="date"
              className={inputClass}
              value={form.desired_date}
              onChange={(e) => setForm({ ...form, desired_date: e.target.value })}
            />
          </Field>
        </div>
      </fieldset>

      {/* Fulfillment */}
      <fieldset>
        <legend
          className="text-base font-semibold text-[var(--color-brown)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pickup or delivery?
        </legend>
        <div className="flex flex-wrap gap-3">
          {FULFILLMENT_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${
                form.fulfillment === opt
                  ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-brown)]"
                  : "bg-white border-[var(--color-parchment)] text-[var(--color-brown-muted)] hover:border-[var(--color-gold)]"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value={opt}
                checked={form.fulfillment === opt}
                onChange={() => setForm({ ...form, fulfillment: opt })}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Event type */}
      <Field label="Event type">
        <select
          className={inputClass}
          value={form.event_type}
          onChange={(e) => setForm({ ...form, event_type: e.target.value })}
        >
          <option value="">Select one (optional)</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      {/* Notes */}
      <Field label="Additional notes">
        <textarea
          rows={3}
          placeholder="Allergies, delivery address, anything else we should know…"
          className={inputClass + " resize-none"}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Field>

      {/* Payment */}
      <fieldset>
        <legend
          className="text-base font-semibold text-[var(--color-brown)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Preferred payment method
        </legend>
        <div className="flex flex-wrap gap-3">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${
                form.payment_method === opt
                  ? "bg-[var(--color-gold-pale)] border-[var(--color-gold)] text-[var(--color-brown)]"
                  : "bg-white border-[var(--color-parchment)] text-[var(--color-brown-muted)] hover:border-[var(--color-gold)]"
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={opt}
                checked={form.payment_method === opt}
                onChange={() => setForm({ ...form, payment_method: opt })}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Something went wrong sending your request. Please call or email us directly:{" "}
          <a href="tel:(928) 555-0100" className="font-semibold underline">
            (928) 555-0100
          </a>{" "}
          /{" "}
          <a href="mailto:hello@porchlightflavor.com" className="font-semibold underline">
            hello@porchlightflavor.com
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto px-10 py-4 rounded-full bg-[var(--color-gold)] text-white font-semibold text-base hover:bg-[var(--color-brown-light)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow"
      >
        {status === "loading" ? "Sending…" : "Send Request"}
      </button>
    </form>
  );
}
