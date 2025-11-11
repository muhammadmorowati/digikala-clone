import ExpressDeliveryAccordion from "@/src/components/accordions/ExpressDeliveryAccordion";
import FaqCategories from "@/src/components/faq/FaqCategories";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import { FileQuestion, Headset, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ExpressDeliveryPage() {
  return (
    <div className="max-lg:mb-20">
      <MobileStickyHeader />

      {/* ───────── Hero Section ───────── */}
      <HeroSection />

      {/* ───────── Description / Policy Section ───────── */}
      <section className="flex flex-col items-center justify-center w-full text-justify leading-9 bg-neutral-000 lg:px-32">
        <div className="container-xl-w px-5 lg:px-4 lg:mx-auto">
          <DeliveryDetails />
          <ExpressDeliveryAccordion />
          <FaqCategories />
        </div>
      </section>

      {/* ───────── Contact Section ───────── */}
      <ContactOptions />
    </div>
  );
}

/* ───── Subcomponents ───── */

function HeroSection() {
  return (
    <section className="relative h-80 bg-gradient-to-b from-neutral-200 to-white dark:from-neutral-700 dark:to-neutral-950">
      <div className="grayscale w-full h-2/3 bg-[url('/nav-links-svg.svg')] opacity-10 dark:opacity-60" />
      <div className="absolute inset-x-0 top-10 mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-sky-950">
          <FileQuestion size={22} className="text-sky-500" />
        </div>
        <p className="my-5 font-irsansb text-xs text-sky-500">
          پیگیری ارسال سفارش
        </p>
        <h1 className="text-lg font-irsansb dark:text-white">
          تحویل اکسپرس دیجی‌کالا چیست؟
        </h1>
      </div>
    </section>
  );
}

/** 🧱 DeliveryDetails - wraps large static content */
function DeliveryDetails() {
  return (
    <article className="space-y-6 py-5 text-sm text-neutral-800 dark:text-neutral-200">
      <p>
        دیجی‌کالا در شهر تهران و برخی از شهرهای پرجمعیت ایران اقدام به{" "}
        <strong className="text-red-600">تحویل فوری</strong> سفارشات نموده است.
      </p>
      <p>
        سفارشات شما طبق شرایط زیر پس از گذشت ۲۴ ساعت کاری تحویل خواهند شد:
        <br />- کالای خریداری شده در انبار دیجی‌کالا موجود باشد.
        <br />- در غیر اینصورت، زمان ارسال کالا از انبار فروشنده به انبار
        دیجی‌کالا اضافه می‌شود.
      </p>
      <p>
        <strong>پرداخت در محل:</strong> بله، شما می‌توانید وجه سفارش خود را هنگام
        تحویل کالا با کلیه کارت‌های بانکی پرداخت کنید.
      </p>

      {/* Example: add one of the images here */}
      <Image
        src="/faq/delivery.webp"
        alt="تحویل اکسپرس دیجی‌کالا"
        width={1500}
        height={800}
        className="w-full rounded-lg object-cover"
      />

      {/* Keep accordion below */}
    </article>
  );
}

function ContactOptions() {
  return (
    <section className="mx-auto mb-10 lg:mb-20">
      <h2 className="mt-10 mb-7 text-center font-irsansb lg:text-xl">
        جواب یا پرسش خود را پیدا نکردید؟
      </h2>

      <div className="flex flex-col-reverse items-center justify-center gap-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 lg:mx-20 lg:flex-row lg:border lg:border-neutral-200 dark:border-neutral-600">
        <ContactCard
          icon={<Headset className="text-neutral-200 dark:text-neutral-700" size={80} />}
          title="تماس تلفنی"
          value="34567890 – 021"
          link="tel:+982134567890"
        />
        <ContactCard
          icon={<Mail className="text-neutral-200 dark:text-neutral-700" size={80} />}
          title="ارسال پیام"
          value="فرم تماس با ما"
          link="/faq/contact-us"
          isForm
        />
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  value,
  link,
  isForm = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  link: string;
  isForm?: boolean;
}) {
  return (
    <div className="flex w-full flex-1 items-center justify-center border-b border-neutral-200 dark:border-neutral-900 px-5 py-5 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-8 px-4 lg:px-16">
        {icon}
        <div className="flex flex-col gap-5">
          <p className="text-subtitle-strong text-neutral-500">{title}</p>
          {isForm ? (
            <Link
              href={link}
              className="rounded-lg border border-neutral-600 p-3 text-center font-irsansb text-neutral-800 dark:text-neutral-100"
            >
              {value}
            </Link>
          ) : (
            <Link
              href={link}
              className="text-2xl font-bold text-neutral-700 dark:text-neutral-100"
            >
              {value}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
