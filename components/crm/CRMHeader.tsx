"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CRMHeader({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/crm/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--color-parchment)] bg-[var(--color-warm-white)] px-4 sm:px-6 py-3 flex items-center justify-between">
      <div>
        <span
          className="text-base font-semibold text-[var(--color-brown)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Porch Light
        </span>
        <span className="ml-2 text-xs text-[var(--color-brown-muted)] hidden sm:inline">
          Order Dashboard
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
    </header>
  );
}
