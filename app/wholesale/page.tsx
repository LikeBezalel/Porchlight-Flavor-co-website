import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wholesale & Catering",
  description:
    "Homemade muffins, cake slices, breads, cookies, brownies and treats for local wholesale and catering orders in Prescott Valley and the Quad City area.",
};

export default function WholesalePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Wholesale & Catering
        </p>
        <h1
          className="text-5xl font-light text-[var(--color-brown)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          For Businesses & Events
        </h1>
      </div>

      <div className="rounded-3xl bg-[var(--color-cream-dark)] p-10 sm:p-14 mb-12">
        <p className="text-lg leading-relaxed text-[var(--color-brown-light)] max-w-2xl mx-auto text-center">
          Need baked goods for your café, coffee shop, office, clients, church gathering, or
          special event? Porch Light Flavor Co. offers homemade muffins, cake slices, breads,
          cookies, brownies, and other treats for local wholesale and catering orders. Submit
          a request and we'll follow up with availability, pricing, and delivery options.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
        {[
          {
            icon: "☕",
            title: "Cafés & Coffee Shops",
            body: "Fresh pastries and muffins your customers will come back for.",
          },
          {
            icon: "🏢",
            title: "Offices & Clients",
            body: "Impress your team or clients with handcrafted treats.",
          },
          {
            icon: "⛪",
            title: "Events & Gatherings",
            body: "Church potlucks, parties, corporate events — we've got you covered.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-[var(--color-warm-white)] border border-[var(--color-parchment)] p-7 text-center"
          >
            <div className="text-3xl mb-3" aria-hidden>
              {card.icon}
            </div>
            <h2
              className="text-lg font-semibold text-[var(--color-brown)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {card.title}
            </h2>
            <p className="text-sm text-[var(--color-brown-muted)] leading-relaxed">
              {card.body}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[var(--color-brown-muted)] mb-6 text-sm">
          Ready to discuss your needs? Submit a request and we'll be in touch.
        </p>
        <Link
          href="/order?type=wholesale"
          className="inline-block px-10 py-4 rounded-full bg-[var(--color-gold)] text-white font-semibold text-base hover:bg-[var(--color-brown-light)] transition-colors shadow"
        >
          Submit a Wholesale Request
        </Link>
      </div>
    </div>
  );
}
