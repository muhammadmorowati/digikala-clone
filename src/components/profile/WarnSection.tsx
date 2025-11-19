import { ChevronLeft, Info } from "lucide-react";

export default function WarnSection() {
  return (
    <section className="border rounded-md text-xs leading-7 max-lg:mx-4 text-orange-500 px-5 py-3 lg:flex items-center justify-between">
      
      {/* MESSAGE */}
      <div className="flex gap-2 items-start w-full">
        <Info size={18} className="text-orange-500 mt-0.5" />
        <p className="text-orange-600 dark:text-orange-400">
          با تایید هویت می‌توانید امنیت حساب کاربری‌تان را افزایش دهید و از امکان
          «خرید اعتباری» نیز استفاده کنید.
        </p>
      </div>

      {/* ACTION BUTTON */}
      <button className="max-lg:w-full whitespace-nowrap font-irsansb text-sky-500 flex items-center gap-1 justify-end mt-3 lg:mt-0">
        تایید هویت
        <ChevronLeft size={18} />
      </button>
    </section>
  );
}
