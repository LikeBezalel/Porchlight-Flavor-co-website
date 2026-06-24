import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Porch Light Flavor Co. — handcrafted baked goods made with love in Prescott Valley, AZ.",
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
        {/* Image placeholder — swap in a real photo */}
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
          <p className="text-lg leading-relaxed text-[var(--color-brown)]" style={{ fontFamily: "var(--font-display)" }}>
            If you had told me years ago that I'd fall in love with baking, I probably wouldn't have believed you.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            I started out as a total tomboy who didn't care much for cooking at all. But getting married changed everything. What was a challenge became something I made myself to — and somewhere along the way, I completely fell in love with it.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            For over 25 years now, baking has been part of my life. What began as learning and growing in the kitchen turned into a true passion. There's something special about creating food that brings people together, and that's what Porch Light Flavor Co. is all about — bringing warmth, comfort, and a little extra joy into your home.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            I'm a Christian, a wife, a mom of three! Jesus and my family are my greatest inspiration. They've been with me through every experiment, every success, every flop 🤭, and every recipe that's become a favorite. Everything I make is created with that same love and care I give to them.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)]">
            My faith is at the center of who I am. I love Jesus, and that love shapes how I live, serve, and create. Porch Light Flavor Co. is more than just baked goods — it's a way for me to share light, kindness, and something meaningful with others.
          </p>
          <p className="leading-relaxed text-[var(--color-brown-muted)] italic">
            I hope every bite feels like home and reminds you that the simplest things can bring the greatest joy.
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
