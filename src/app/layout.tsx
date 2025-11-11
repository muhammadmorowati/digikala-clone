import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Loading from "./loading";
import { ThemeProvider } from "@/src/components/ui/theme-provider";
import { CartProvider } from "@/src/utils/cartItemsContext";
import { cn } from "@/src/utils/utils";
import "@/src/app/globals.css";

/** ✅ Load Iranian Sans font locally */
const iranSans = localFont({
  src: "../fonts/IranianSans.ttf",
  display: "swap", // better rendering performance
});

/** ✅ SEO Metadata */
export const metadata = {
  title: {
    default: "فروشگاه اینترنتی دیجی‌کالا",
    template: "دیجی‌کالا - %s",
  },
  description:
    "هر آنچه که نیاز دارید با بهترین قیمت از دیجی‌کالا بخرید! جدیدترین انواع گوشی موبایل، لپ تاپ، لباس، لوازم آرایشی و بهداشتی، کتاب، لوازم خانگی، خودرو و... با امکان تعویض و مرجوعی آسان | ✓ارسال رايگان ✓پرداخت در محل ✓ضمانت بازگشت کالا - برای خرید کلیک کنید!",
  openGraph: {
    title: "دیجی‌کالا - فروشگاه اینترنتی",
    description:
      "خرید آسان و سریع انواع کالا با ارسال رایگان و پرداخت در محل از فروشگاه اینترنتی دیجی‌کالا.",
    locale: "fa_IR",
    siteName: "دیجی‌کالا",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://www.digikala.com/",
  },
};

/** ✅ Root Layout — wraps the entire application */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fa" dir="rtl">
      <body
        className={cn(
          "bg-background min-h-screen antialiased",
          iranSans.className
        )}
      >
        {/* 🟥 Top Loading Bar */}
        <NextTopLoader showSpinner={false} color="#e11d48" height={3} />

        {/* 🌓 Global Theme + Cart Context */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </CartProvider>

          {/* 🔔 Toast Notifications */}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
