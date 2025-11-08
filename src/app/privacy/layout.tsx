import Footer from "@/src/components/footer/Footer";
import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";

export default async function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="max-lg:hidden sticky top-0 bg-white dark:bg-neutral-950 z-40">
        <Header />
      </div>
      <div className="lg:hidden sticky top-0 bg-white dark:bg-neutral-950 z-40">
        <MobileStickyHeader />
      </div>
      {children}
      <div className="max-lg:hidden">
        <Footer />
      </div>
      <MobileFooter />
    </div>
  );
}
