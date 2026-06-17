import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brown)] text-[var(--color-parchment)] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p
            className="text-lg font-semibold text-white mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Porch Light Flavor Co.
          </p>
          <p className="text-sm text-[var(--color-parchment)]/70 leading-relaxed">
            {siteConfig.deliveryNote}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-3">
            Quick Links
          </p>
          <ul className="space-y-1.5 text-sm">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/order", label: "Request an Order" },
              { href: "/wholesale", label: "Wholesale" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[var(--color-parchment)]/80 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-3">
            Get in Touch
          </p>
          <ul className="space-y-1.5 text-sm text-[var(--color-parchment)]/80">
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                className="hover:text-white transition-colors"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-white transition-colors"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3 pt-1">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <span className="opacity-40">·</span>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-xs text-[var(--color-parchment)]/40">
        &copy; {new Date().getFullYear()} Porch Light Flavor Co. All rights reserved.
      </div>
    </footer>
  );
}
