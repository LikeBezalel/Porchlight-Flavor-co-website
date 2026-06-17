import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Porch Light Flavor Co. — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Say hello
        </p>
        <h1
          className="text-5xl font-light text-[var(--color-brown)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Contact Us
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {[
          {
            label: "Phone",
            value: siteConfig.phone,
            href: `tel:${siteConfig.phone}`,
          },
          {
            label: "Email",
            value: siteConfig.email,
            href: `mailto:${siteConfig.email}`,
          },
          {
            label: "Instagram",
            value: "@porchlightflavorco",
            href: siteConfig.socials.instagram,
            external: true,
          },
          {
            label: "Facebook",
            value: "Porch Light Flavor Co.",
            href: siteConfig.socials.facebook,
            external: true,
          },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex flex-col gap-1 rounded-2xl bg-[var(--color-warm-white)] border border-[var(--color-parchment)] p-7 hover:shadow-sm hover:border-[var(--color-gold)]/40 transition-all group"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              {item.label}
            </span>
            <span className="text-base font-medium text-[var(--color-brown)] group-hover:text-[var(--color-gold)] transition-colors">
              {item.value}
            </span>
          </a>
        ))}
      </div>

      <div className="rounded-3xl bg-[var(--color-cream-dark)] p-10 text-center">
        <p className="text-[var(--color-brown-muted)] mb-6">
          Ready to place an order? Use our order request form and we'll get back to you shortly.
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
