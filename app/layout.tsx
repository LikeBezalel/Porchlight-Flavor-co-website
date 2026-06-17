import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Porch Light Flavor Co. | Handcrafted Baked Goods",
    template: "%s | Porch Light Flavor Co.",
  },
  description:
    "Artisan muffins, cake slices, breads, brownies, and cookies. Serving Prescott Valley and the Quad City area with pickup, local delivery, catering, and wholesale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
