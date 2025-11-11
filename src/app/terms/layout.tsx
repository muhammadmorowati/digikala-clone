import Footer from "@/src/components/footer/Footer";
import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import { Metadata } from "next";

/** ✅ Metadata for Terms & Conditions page */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: "دیجی‌کالا - شرایط و قوانین",
      template: "دیجی‌کالا - %s",
    },
  };
}

/** ✅ Layout wrapper for Terms page */
export default async function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden max-lg:block bg-white dark:bg-neutral-950">
        <Header />
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 lg:hidden bg-white dark:bg-neutral-950">
        <MobileStickyHeader />
      </header>

      {/* Page Content */}
      <main className="flex-grow">{children}</main>

      {/* Desktop Footer */}
      <footer className="hidden max-lg:block">
        <Footer />
      </footer>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  );
}
