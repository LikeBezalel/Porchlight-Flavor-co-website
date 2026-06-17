import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Porch Light Flavor Co. — handcrafted baked goods made with care in Prescott Valley, AZ.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Our story
        </p>
        <h1
          className="text-5xl font-light text-[var(--color-brown)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          About Porch Light Flavor Co.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        {/* Image placeholder */}
        <div className="aspect-square rounded-3xl bg-[var(--color-cream-dark)] flex items-center justify-center">
          <span
            className="text-8xl font-light opacity-10 text-[var(--color-brown)]"
            style={{ fontFamily: "var(--font-display)" }}
            aria-hidden
          >
            PL
          </span>
        </div>

        <div className="space-y-5">
          <p className="text-lg leading-relaxed text-[var(--color-brown-light)]">
            Porch Light Flavor Co. started the way the best things do — with a warm kitchen,
            good ingredients, and the desire to share something made with care.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            Every item we bake is made from scratch in small batches. No shortcuts, no
            preservatives — just real butter, fresh eggs, and flavors worth savoring. We
            believe a great muffin or a slice of cake can turn an ordinary day into a
            memorable one.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            We serve Prescott Valley and the surrounding Quad City area with pickup and
            local delivery, plus wholesale and catering for businesses, churches, and events.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            {siteConfig.deliveryNote}
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-cream-dark)] rounded-3xl p-10 text-center">
        <h2
          className="text-3xl font-light text-[var(--color-brown)] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Want to work together?
        </h2>
        <p className="text-[var(--color-brown-muted)] mb-6 max-w-sm mx-auto">
          Whether it's a personal treat or an order for your business, we'd love to bake for you.
        </p>
        <Link
          href="/order"
          className="inline-block px-8 py-3.5 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm hover:bg-[var(--color-brown-light)] transition-colors"
        >
          Request an Order
        </Link>
      </div>
    </div>
  );
}
