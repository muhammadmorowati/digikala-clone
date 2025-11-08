import Footer from "@/src/components/footer/Footer";
import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <div className="max-lg:hidden">
        <Footer />
      </div>
      <MobileFooter />
    </>
  );
}
