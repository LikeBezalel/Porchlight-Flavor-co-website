import type { Metadata } from "next";
import Link from "next/link";
import { menuCategories } from "@/data/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our full menu of handcrafted muffins, cake slices, breads, and treats.",
};

export default function MenuPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Fresh-baked to order
        </p>
        <h1
          className="text-5xl font-light text-[var(--color-brown)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Our Menu
        </h1>
      </div>

      <div className="space-y-20">
        {menuCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-24">
            <div className="mb-6 pb-4 border-b border-[var(--color-parchment)]">
              <h2
                className="text-3xl font-semibold text-[var(--color-brown)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-brown-muted)] max-w-xl">
                {cat.tagline}
              </p>
              {cat.label && (
                <span className="inline-block mt-2 text-xs font-semibold text-[var(--color-gold)] bg-[var(--color-gold-pale)] px-3 py-1 rounded-full">
                  {cat.label}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl bg-[var(--color-warm-white)] border border-[var(--color-parchment)] overflow-hidden"
                >
                  {/* Image placeholder — swap in a real image by adding item.image to menu.ts */}
                  <div className="aspect-[3/2] bg-[var(--color-cream-dark)] flex items-end justify-end p-3">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="text-base font-semibold text-[var(--color-brown)] leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.name}
                      </h3>
                      {item.price && (
                        <span className="text-xs font-semibold text-[var(--color-gold)] whitespace-nowrap mt-0.5">
                          {item.price}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-brown-muted)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-[var(--color-brown-muted)] mb-4">
          See something you like? Place a request and we'll confirm availability.
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
