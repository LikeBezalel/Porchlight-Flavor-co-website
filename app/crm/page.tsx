import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KanbanBoard from "@/components/crm/KanbanBoard";
import type { Order } from "@/lib/types";
import CRMHeader from "@/components/crm/CRMHeader";

export default async function CRMPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/crm/login");

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">
      <CRMHeader userEmail={user.email ?? ""} />
      <div className="flex-1 py-6">
        <KanbanBoard initialOrders={(orders ?? []) as Order[]} />
      </div>
    </div>
  );
}
