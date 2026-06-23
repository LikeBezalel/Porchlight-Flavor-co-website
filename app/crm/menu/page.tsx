import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CRMHeader from "@/components/crm/CRMHeader";
import MenuManager from "@/components/crm/menu/MenuManager";
import type { DbCategory, DbMenuItem } from "@/components/crm/menu/MenuManager";

export default async function CRMMenuPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/crm/login");

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">
      <CRMHeader userEmail={user.email ?? ""} />
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-light text-[var(--color-brown)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Menu Management
          </h1>
          <p className="text-sm text-[var(--color-brown-muted)] mt-1">
            Edit items, upload photos, and control what appears in the homepage banner.
          </p>
        </div>
        <MenuManager
          categories={(categories ?? []) as DbCategory[]}
          items={(items ?? []) as DbMenuItem[]}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}
        />
      </div>
    </div>
  );
}
