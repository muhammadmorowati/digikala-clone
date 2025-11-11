import {
  Bug,
  ChevronLeft,
  Coins,
  FileQuestion,
  Instagram,
  Linkedin,
  MessageCircleWarning,
  Repeat,
  ShoppingBag,
  Twitter,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────── Types ───────────────────────────
interface ReportItem {
  title: string;
  icon: LucideIcon;
}

// ─────────────────────────── Data ───────────────────────────
const REPORTS: ReportItem[] = [
  { title: "درخواست مرجوعی", icon: Repeat },
  { title: "مشکل در امتیاز دیجی‌کلاب", icon: Coins },
  { title: "پیگیری سفارش و بازگشت وجه", icon: ShoppingBag },
  { title: "انتقادات و پیشنهادات", icon: MessageCircleWarning },
  { title: "سوالات متداول", icon: FileQuestion },
  { title: "گزارش خطای فنی", icon: Wrench },
  { title: "گزارش آسیب‌پذیری امنیتی", icon: Bug },
];

// ─────────────────────────── Component ───────────────────────────
export default function BugReport() {
  return (
    <div className="max-lg:pb-14">
      {/* Hero section */}
      <div className="flex h-32 items-center bg-[url(/bug-report-background.jpg)] bg-center">
        <Link href="/" className="mr-5 lg:mr-44">
          <Image
            src="/logo/Digikala-Logo-white-fa.svg"
            alt="Digikala Logo"
            width={150}
            height={150}
          />
        </Link>
      </div>

      {/* Warning banner */}
      <div className="bg-red-500 px-5 py-2.5 text-center text-[13px] leading-6 text-white sm:px-10 lg:px-20">
        لطفا مشکلات مربوط به سفارش خود را از طریق فرم{" "}
        <Link
          target="_blank"
          href="/faq/contact-us"
          className="border-b border-dashed dark:border-white"
        >
          تماس با ما
        </Link>{" "}
        گزارش کنید. مشکلات سفارش‌ در فرم زیر رسیدگی نخواهد شد.
      </div>

      {/* Report links */}
      <section className="my-5 px-5 sm:px-10 lg:px-20">
        <div className="lg:hidden">
          <h1 className="font-irsansb text-neutral-600 dark:text-white lg:text-xl">
            گزارش خطا
          </h1>
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            لطفا یکی از موارد زیر را انتخاب نمایید.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {REPORTS.map(({ title, icon: Icon }) => (
            <Link
              key={title}
              href="/faq/contact-us"
              className="flex items-center justify-between rounded-lg border p-5 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
            >
              <div className="flex items-center gap-10">
                <Icon size={20} className="text-red-500" />
                <p className="font-irsansb text-sm text-neutral-700 dark:text-neutral-200">
                  {title}
                </p>
              </div>
              <ChevronLeft size={20} />
            </Link>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section className="mt-10 bg-neutral-200 px-5 py-5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 sm:px-10 lg:px-20 lg:text-sm">
        <h3 className="mb-5 text-lg lg:text-xl">شرایط و قوانین</h3>
        <p className="leading-7 lg:leading-8">
          با توجه به اهمیت خطای گزارش شده از سوی شما، دیجی‌کالا به پاس قدردانی
          هدیه‌ای برای شما در نظر خواهد گرفت. توجه داشته باشید بعضی از مشکلات به
          دلیل کم اهمیت بودن شامل هدیه نخواهند بود.
        </p>
        <p className="mt-3 leading-7 lg:leading-8">
          لطفا توجه داشته باشید قبل از برطرف شدن خطای گزارش شده، هیچگونه
          اطلاعاتی در مورد آن را عمومی نکرده یا با دیگران به اشتراک نگذارید.
          بدون رضایت افراد با حساب کاربری آن‌ها تعاملی نداشته باشید و از شکستن
          حریم شخصی افراد و ایجاد مشکل در اطلاعات دیگران اجتناب کنید. همچنین به
          هیچ عنوان از مشکلات امنیتی‌ای که یافته‌اید، بهره‌برداری و سوءاستفاده
          نکنید و به قوانین کشور پایبند باشید.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-t-red-500 bg-neutral-950 px-5 py-10 sm:px-10 lg:px-20">
        <div className="flex flex-col justify-between lg:flex-row lg:items-center">
          <Link href="/">
            <Image
              src="/logo/Digikala-Logo-white-fa.svg"
              alt="Digikala Logo"
              width={100}
              height={100}
            />
          </Link>

          <div className="flex flex-col items-center justify-between lg:flex-row lg:gap-10">
            <div className="my-5 flex items-center gap-5 text-white">
              <SocialLink href="https://www.instagram.com/digikalacom">
                <Instagram size={20} />
              </SocialLink>
              <SocialLink href="https://x.com/digikalacom">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="https://ir.linkedin.com/company/digikala">
                <Linkedin
                  className="rounded-[3px] bg-white p-1 fill-black stroke-neutral-900"
                  size={20}
                />
              </SocialLink>
              <SocialLink href="https://www.aparat.com/digikala/">
                <AparatIcon />
              </SocialLink>
            </div>
            <p className="text-xs text-neutral-50">با ما در ارتباط باشید</p>
          </div>
        </div>

        <p className="mt-5 text-xs leading-6 text-neutral-50">
          برای استفاده از مطالب دیجی‌کالا، داشتن «هدف غیرتجاری» و ذکر «منبع»
          کافیست. تمام حقوق اين وب‌سايت نیز برای شرکت نوآوران فن آوازه (فروشگاه
          آنلاین دیجی‌کالا) است.
        </p>
      </footer>
    </div>
  );
}

// ─────────────────────────── Components ───────────────────────────
function SocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link target="_blank" href={href} className="hover:opacity-80 transition">
      {children}
    </Link>
  );
}

function AparatIcon() {
  return (
    <svg
      fill="#fff"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.001 1.594c-9.27-.003-13.913 11.203-7.36 17.758a10.403 10.403 0 0 0 17.76-7.355c0-5.744-4.655-10.401-10.4-10.403zM6.11 6.783c.501-2.598 3.893-3.294 5.376-1.103 1.483 2.19-.422 5.082-3.02 4.582A2.97 2.97 0 0 1 6.11 6.783zm4.322 8.988c-.504 2.597-3.897 3.288-5.377 1.096-1.48-2.192.427-5.08 3.025-4.579a2.97 2.97 0 0 1 2.352 3.483zm1.26-2.405c-1.152-.223-1.462-1.727-.491-2.387.97-.66 2.256.18 2.04 1.334a1.32 1.32 0 0 1-1.548 1.053zm6.198 3.838c-.501 2.598-3.893 3.293-5.376 1.103-1.484-2.191.421-5.082 3.02-4.583a2.97 2.97 0 0 1 2.356 3.48zm-1.967-5.502c-2.598-.501-3.293-3.896-1.102-5.38 2.19-1.483 5.081.422 4.582 3.02a2.97 2.97 0 0 1-3.48 2.36zM13.59 23.264l2.264.61a3.715 3.715 0 0 0 4.543-2.636l.64-2.402a11.383 11.383 0 0 1-7.448 4.428zm7.643-19.665L18.87 2.97a11.376 11.376 0 0 1 4.354 7.62l.65-2.459A3.715 3.715 0 0 0 21.231 3.6zM.672 13.809l-.541 2.04a3.715 3.715 0 0 0 2.636 4.543l2.107.562a11.38 11.38 0 0 1-4.203-7.145zM10.357.702 8.15.126a3.715 3.715 0 0 0-4.547 2.637l-.551 2.082A11.376 11.376 0 0 1 10.358.702z" />
    </svg>
  );
}
