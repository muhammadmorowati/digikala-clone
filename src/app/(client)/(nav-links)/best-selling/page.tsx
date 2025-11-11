import BestsellingMain from "@/src/components/best-selling/BestsellingMain";
import { mockCategories, mockProducts } from "@/src/data/bestSellingData";

export default function BestsellingPage() {
  // 🔹 Sort best-sellers by recommendation percentage
  const bestSellerProducts = [...mockProducts].sort(
    (a, b) => b.recommended_percent - a.recommended_percent
  );

  return (
    <div className="mb-10">
      <SectionHeader title="پرفروش‌ترین‌ها" subtitle="۳۰ روز گذشته" />

      {/* 🔹 Main content */}
      <BestsellingMain
        categories={mockCategories}
        bestSellerProducts={bestSellerProducts}
      />
    </div>
  );
}

// ✅ Extracted header for reusability
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative h-36 w-full">
      <div className="bg-gradient-to-l h-0.5 absolute bottom-0 left-0 w-1/2 from-[#e20000] to-white dark:to-black" />
      <div className="bg-gradient-to-r h-0.5 absolute bottom-0 right-0 w-1/2 from-[#e20000] to-white dark:to-black" />
      <div className="absolute inset-0 bg-[url('/nav-links-svg.svg')] h-36 opacity-30" />
      <h1 className="absolute inset-0 flex flex-col items-center justify-center text-red-500 bg-white dark:bg-neutral-950 lg:text-4xl text-xl font-bold">
        {title}
        {subtitle && (
          <span className="text-base text-neutral-900 dark:text-white mt-1">{subtitle}</span>
        )}
      </h1>
    </div>
  );
}
