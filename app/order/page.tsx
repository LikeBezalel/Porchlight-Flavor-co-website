import type { Metadata } from "next";
import OrderForm from "@/components/order/OrderForm";

export const metadata: Metadata = {
  title: "Request an Order",
  description: "Place a custom order for muffins, cake slices, breads, treats, catering, and more.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const isWholesale = type === "wholesale";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
          {isWholesale ? "Wholesale & Catering" : "Custom Orders"}
        </p>
        <h1
          className="text-4xl sm:text-5xl font-light text-[var(--color-brown)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isWholesale ? "Request Wholesale Pricing" : "Request an Order"}
        </h1>
        <p className="text-[var(--color-brown-muted)] leading-relaxed">
          Fill out the form below and we'll follow up to confirm availability,
          pricing, and pickup or delivery details. No payment required now.
        </p>
      </div>

      <OrderForm defaultWholesale={isWholesale} />
    </div>
  );
}
