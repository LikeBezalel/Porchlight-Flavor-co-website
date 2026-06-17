"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/data/site";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-warm-white)] border-b border-[var(--color-parchment)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-brown)] hover:text-[var(--color-gold)] transition-colors leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Porch Light<br className="hidden sm:block" />
          <span className="sm:hidden"> </span>Flavor Co.
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="ml-2 px-4 py-2 rounded-full bg-[var(--color-gold)] text-white text-sm font-semibold hover:bg-[var(--color-brown-light)] transition-colors"
          >
            Request an Order
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-0.5 bg-[var(--color-brown)] transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-[var(--color-brown)] transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-[var(--color-brown)] transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden border-t border-[var(--color-parchment)] bg-[var(--color-warm-white)] px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-[var(--color-brown-muted)] hover:text-[var(--color-brown)]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-full bg-[var(--color-gold)] text-white text-sm font-semibold text-center hover:bg-[var(--color-brown-light)] transition-colors"
            >
              Request an Order
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
