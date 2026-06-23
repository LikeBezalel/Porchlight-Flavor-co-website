import Link from "next/link";
import { menuCategories } from "@/data/menu";
import { siteConfig } from "@/data/site";
import { createClient } from "@/lib/supabase/server";

async function getFeaturedItems() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("menu_items")
      .select("id, name, description, price, image_url, category_id")
      .eq("featured", true)
      .eq("visible", true)
      .order("sort_order")
      .limit(6);
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const featuredItems = await getFeaturedItems();
  const fallbackCategories = menuCategories.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="porch-light-glow relative bg-[var(--color-cream-dark)] overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-36 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-4">
            Handcrafted in small batches
          </p>
          <h1
            className="text-5xl sm:text-7xl font-light text-[var(--color-brown)] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Baked with love,
            <br />
            <em className="italic">delivered with warmth.</em>
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-brown-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            {siteConfig.deliveryNote}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="px-8 py-3.5 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm sm:text-base hover:bg-[var(--color-brown-light)] transition-colors shadow-sm"
            >
              Request an Order
            </Link>
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-full border-2 border-[var(--color-brown)] text-[var(--color-brown)] font-semibold text-sm sm:text-base hover:bg-[var(--color-parchment)] transition-colors"
            >
              View the Menu
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[var(--color-cream)] rounded-t-[100%] scale-x-110" />
      </section>

      {/* Featured section — items from CRM if available, else static categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
            What we bake
          </p>
          <h2
            className="text-4xl font-light text-[var(--color-brown)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Something for every occasion
          </h2>
        </div>

        {featuredItems && featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                href="/menu"
                className="group rounded-2xl bg-[var(--color-warm-white)] border border-[var(--color-parchment)] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="aspect-[4/3] bg-[var(--color-cream-dark)] flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span
                      className="text-5xl font-light opacity-20 select-none text-[var(--color-brown)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.name[0]}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className="text-base font-semibold text-[var(--color-brown)] group-hover:text-[var(--color-gold)] transition-colors leading-snug"
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
                  <p className="text-sm text-[var(--color-brown-muted)] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fallbackCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu#${cat.id}`}
                className="group rounded-2xl bg-[var(--color-warm-white)] border border-[var(--color-parchment)] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="aspect-[4/3] bg-[var(--color-cream-dark)] flex items-center justify-center">
                  <span
                    className="text-5xl font-light opacity-20 select-none text-[var(--color-brown)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cat.title[0]}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className="text-lg font-semibold text-[var(--color-brown)] mb-1 group-hover:text-[var(--color-gold)] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[var(--color-brown-muted)] leading-relaxed line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/menu"
            className="text-sm font-semibold text-[var(--color-gold)] hover:text-[var(--color-brown-light)] underline underline-offset-4"
          >
            See the full menu →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--color-cream-dark)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
            Simple as that
          </p>
          <h2
            className="text-4xl font-light text-[var(--color-brown)] mb-12"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How ordering works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit a request",
                body: "Fill out our order form with your flavors, quantity, date, and delivery preference.",
              },
              {
                step: "02",
                title: "We confirm availability",
                body: "We'll follow up personally to confirm availability, pricing, and any details.",
              },
              {
                step: "03",
                title: "Pay and enjoy",
                body: "Choose your payment method and pick up or receive your order fresh-baked.",
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <span
                  className="text-5xl font-light text-[var(--color-gold)]/30"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.step}
                </span>
                <h3
                  className="text-xl font-semibold text-[var(--color-brown)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-[var(--color-brown-muted)] leading-relaxed max-w-xs">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-3xl bg-[var(--color-brown)] text-white p-10 sm:p-14 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-3">
              Wholesale & Catering
            </p>
            <h2
              className="text-3xl sm:text-4xl font-light mb-4 leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Stocking a café or planning an event?
            </h2>
            <p className="text-[var(--color-parchment)]/80 leading-relaxed text-sm sm:text-base max-w-md">
              We offer homemade baked goods for local wholesale and catering orders.
              Submit a request and we'll follow up with availability and pricing.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/wholesale"
              className="inline-block px-8 py-3.5 rounded-full bg-[var(--color-gold)] text-white font-semibold text-sm hover:bg-[var(--color-gold-light)] transition-colors"
            >
              Learn about Wholesale
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[var(--color-gold-pale)] py-20 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2
            className="text-4xl font-light text-[var(--color-brown)] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to place an order?
          </h2>
          <p className="text-[var(--color-brown-muted)] mb-8 text-sm sm:text-base">
            Tell us what you're craving and we'll take it from there.
          </p>
          <Link
            href="/order"
            className="inline-block px-10 py-4 rounded-full bg-[var(--color-gold)] text-white font-semibold text-base hover:bg-[var(--color-brown-light)] transition-colors shadow"
          >
            Request an Order
          </Link>
        </div>
      </section>
    </>
  );
}
