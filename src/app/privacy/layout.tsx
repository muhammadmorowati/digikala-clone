import Footer from "@/src/components/footer/Footer";
import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import { Metadata } from "next";
import path from "path";
import { promises as fs } from "fs";

/** Optional: read metadata dynamically if you centralize titles */
async function readPageMeta(fileName: string) {
  const filePath = path.join(process.cwd(), "data", "pages", fileName);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await readPageMeta("privacy.json");
  return {
    title: {
      absolute: meta.absoluteTitle,
      template: meta.titleTemplate,
    },
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden max-lg:block bg-white dark:bg-neutral-950">
        <Header />
      </header>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white dark:bg-neutral-950">
        <MobileStickyHeader />
      </div>

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Desktop Footer */}
      <footer className="hidden max-lg:block">
        <Footer />
      </footer>

      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  );
}
