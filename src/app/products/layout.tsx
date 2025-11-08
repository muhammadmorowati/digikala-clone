import Footer from "@/src/components/footer/Footer";
import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";


export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="max-lg:hidden sticky top-0 bg-white dark:bg-neutral-950 z-40">
        <Header />
      </div>
      {children}
      <Footer />
      <MobileFooter />
    </div>
  );
}
