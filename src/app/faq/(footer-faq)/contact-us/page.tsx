import ContactForm from "@/src/components/faq/ContactForm";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import MapClient from "@/src/components/faq/MapClient";
import { authUser } from "@/src/utils/auth";
import { User } from "@/src/utils/types";
import { Clock, Headset, Info, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تماس با ما",
  };
}

export default async function ContactUsPage() {
  const user = (await authUser()) as User | null;

  return (
    <div className="max-lg:mb-20">
      <MobileStickyHeader />

      {/* Divider for Mobile */}
      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-900 lg:hidden" />

      <div className="space-y-5 py-5 lg:px-20">
        {/* ───── Contact Form Section ───── */}
        <section className="rounded-lg p-5 lg:border">
          <h4 className="w-fit border-b-2 border-b-red-500 pb-3 font-irsansb dark:text-white max-lg:text-sm">
            تماس با دیجی‌کالا
          </h4>

          <div className="mt-5 flex items-center justify-between text-xs">
            <p>
              لطفاً پیش از ارسال ایمیل یا تماس تلفنی، ابتدا{" "}
              <Link href="/faq" className="text-sky-500">
                پرسش‌‌های متداول
              </Link>{" "}
              را مشاهده کنید.
            </p>
            <Link
              href="/faq"
              className="max-lg:hidden rounded-md border border-sky-500 px-3 py-2 text-sky-500"
            >
              پرسش‌‌های متداول
            </Link>
          </div>

          <hr className="my-5 text-neutral-50" />

          <ContactForm user={user} />
        </section>

        {/* ───── Holiday Section ───── */}
        <section className="rounded-lg p-5 lg:border">
          <Header title="تعطیلات دیجی‌کالا" />
          <p className="mb-5 text-xs text-neutral-600 dark:text-neutral-300">
            روزهایی که به دلیل تعطیلی رسمی، دیجی‌کالا هیچ‌گونه پاسخگویی، سرویس‌دهی و خدماتی ندارد، در سال ۱۴۰۳ به شرح زیر است:
          </p>

          <HolidayGrid holidays={holidays} />
        </section>

        {/* ───── Info Section ───── */}
        <section className="rounded-lg border border-t-8 p-5">
          <h4 className="w-fit border-b-2 border-b-red-500 pb-3 font-irsansb dark:text-white max-lg:text-sm">
            اطلاعات دیجی‌کالا
          </h4>

          <div className="mt-10 flex items-center gap-3">
            <Image
              alt="logo"
              width={100}
              height={100}
              src="/logo/footerlogo2.webp"
              className="h-8 w-8 rounded-full object-cover"
            />
            <h4 className="text-xl">دفتر مرکزی</h4>
          </div>

          <p className="mt-3 text-xs text-neutral-700 dark:text-neutral-300">
            استان تهران، شهر تهران - خیابان گاندی جنوبی - نبش خیابان ۲۱ - پلاک ۲۸
          </p>

          <h4 className="mt-10 text-xl">خدمات پس از فروش</h4>
          <p className="mt-3 text-xs leading-6 text-neutral-700 dark:text-neutral-300">
            لطفاً کالا را برای بازگرداندن به خدمات پس از فروش دیجی‌کالا تنها از طریق پست و به صندوق پستی 1119-13185 ارسال کنید.  
            (می‌توانید از طریق بخش «سفارش‌های من» اقدام به بازگردانی کالا کنید.)
          </p>

          <div className="my-5">
            <MapClient />
          </div>

          <hr className="my-10 text-neutral-50" />

          <SupportSection />
        </section>
      </div>
    </div>
  );
}

/* ───── Subcomponents ───── */
function Header({ title }: { title: string }) {
  return (
    <div className="mb-3 break-words py-3 lg:mb-4">
      <div className="flex w-fit items-center border-b-2 border-b-red-500 pb-3 font-irsansb">
        <p className="text-sm text-neutral-900 dark:text-white lg:text-base">
          <span className="relative">{title}</span>
        </p>
      </div>
    </div>
  );
}

function HolidayGrid({ holidays }: { holidays: Holiday[] }) {
  return (
    <div className="mx-auto grid w-full grid-cols-12 flex-wrap items-center justify-center gap-2 lg:px-20">
      {holidays.map(({ day, month, label }) => (
        <div
          key={`${day}-${month}`}
          className="border-complete col-span-6 flex flex-col items-center justify-center rounded-lg border p-5 text-center lg:col-span-3"
        >
          <span className="mb-2 font-bold">{day}</span>
          <span className="w-28 border-b pb-3 text-sm">{month}</span>
          <span className="mt-2 w-full pt-1 text-center text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}

interface Holiday {
  day: string;
  month: string;
  label: string;
}

const holidays: Holiday[] = [
  { day: "۱", month: "فروردین", label: "عید نوروز" },
  { day: "۱۳", month: "فروردین", label: "روز طبیعت" },
  { day: "۱۴", month: "خرداد", label: "رحلت امام خمینی(ره)" },
  { day: "۲۵", month: "تیر", label: "تاسوعای حسینی" },
  { day: "۲۶", month: "تیر", label: "عاشورای حسینی" },
  { day: "۴", month: "شهریور", label: "اربعین حسینی" },
  { day: "۱۲", month: "شهریور", label: "رحلت حضرت رسول اکرم" },
  { day: "۲۲", month: "بهمن", label: "سالگرد پیروزی انقلاب اسلامی" },
];

function SupportSection() {
  return (
    <>
      <p className="flex items-center justify-center gap-2 pb-5 text-center text-xs font-irsansb">
        <Clock size={20} />
        پاسخگویی ۲۴ ساعته و ۷ روز هفته
      </p>

      <div className="flex items-center gap-5">
        {/* Phone */}
        <div className="flex h-44 flex-1 flex-col items-center gap-2 rounded-lg bg-neutral-50 p-5 text-xs dark:bg-neutral-800">
          <Headset className="shrink-0 text-neutral-700 dark:text-neutral-300" size={25} />
          <p className="my-3 text-sm text-neutral-500 dark:text-neutral-400 lg:text-base">
            تلفن تماس و فکس
          </p>
          <div className="flex flex-col gap-3">
            <Link className="font-bold" href="tel:+982134567890">
              34567890 – 021
            </Link>
            <Link className="font-bold" href="tel:+982134567890">
              34567890 – 021
            </Link>
          </div>
        </div>

        {/* Email */}
        <div className="flex h-44 flex-1 flex-col items-center gap-2 rounded-lg bg-neutral-50 p-5 text-xs dark:bg-neutral-800">
          <Mail className="shrink-0 text-neutral-700 dark:text-neutral-300" size={25} />
          <p className="my-3 text-sm text-neutral-600 dark:text-neutral-400 lg:text-base">
            ایمیل سازمانی
          </p>
          <Link
            href="mailto:info@digikala.com"
            className="font-bold text-black dark:font-medium dark:text-white"
          >
            info@digikala.com
          </Link>
        </div>
      </div>

      <hr className="my-5 text-neutral-50" />

      <small className="flex gap-2 leading-6 text-neutral-400">
        <Info size={15} className="mt-1 shrink-0" />
        توجه داشته باشید که 300061930000، 100061930000 و 50003101 تنها شماره‌هایی هستند که دیجی‌کالا از طریق آن برای کاربران خود پیامک ارسال می‌کند.  
        ارسال هرگونه پیامک از شماره دیگر، سوء‌استفاده از نام دیجی‌کالا محسوب می‌شود.  
        در صورت مشاهده، لطفاً آن را به info@digikala.com اطلاع دهید.
      </small>
    </>
  );
}
