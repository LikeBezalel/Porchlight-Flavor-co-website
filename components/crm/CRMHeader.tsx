"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CRMHeader({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/crm/login");
    router.refresh();
  }

  const tabs = [
    { href: "/crm", label: "Orders" },
    { href: "/crm/menu", label: "Menu" },
  ];

  return (
    <header className="border-b border-[var(--color-parchment)] bg-[var(--color-warm-white)]">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <span
            className="text-base font-semibold text-[var(--color-brown)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Porch Light
          </span>
          <span className="ml-2 text-xs text-[var(--color-brown-muted)] hidden sm:inline">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-brown-muted)] hidden sm:inline truncate max-w-[180px]">
            {userEmail}
          </span>
          <button
            onClick={signOut}
            className="text-xs font-semibold text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] px-3 py-1.5 rounded-full border border-[var(--color-parchment)] hover:border-[var(--color-gold)]/40 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
      <nav className="flex px-4 sm:px-6 gap-1 -mb-px">
        {tabs.map((tab) => {
          const active =
            tab.href === "/crm"
              ? pathname === "/crm"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-colors ${
                active
                  ? "border-[var(--color-gold)] text-[var(--color-brown)]"
                  : "border-transparent text-[var(--color-brown-muted)] hover:text-[var(--color-brown)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
