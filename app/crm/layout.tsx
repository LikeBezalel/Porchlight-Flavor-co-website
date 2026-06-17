import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM Dashboard | Porch Light Flavor Co.",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {children}
    </div>
  );
}
