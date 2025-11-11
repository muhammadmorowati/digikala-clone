import ReturnAccordion from "@/src/components/accordions/ReturnAccordion";
import FaqCategories from "@/src/components/faq/FaqCategories";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import { FileQuestion, Headset, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import { promises as fs } from "fs";

// 🔹 Utility to read static content from JSON
async function readPageData(fileName: string) {
  const filePath = path.join(process.cwd(), "data", "pages", fileName);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

export default async function ReturnPage() {
  const { images, sections } = await readPageData("return.json");

  return (
    <div className="max-lg:mb-20">
      <MobileStickyHeader />

      <HeroSection />

      {/* Main Content */}
      <section className="bg-neutral-000 flex flex-col items-center justify-center w-full leading-9 text-justify lg:px-32">
        <article className="container-xl-w px-5 lg:px-4 lg:mx-auto">
          {/* Images */}
          <div className="space-y-5">
            {images.map((src: string, idx: number) => (
              <Image
                key={idx}
                alt="return"
                width={1000}
                height={1000}
                src={src}
                className="mx-auto h-full w-full object-cover"
              />
            ))}
          </div>

          {/* Link to Guarantee */}
          <p className="py-5 text-center text-lg">
            " جهت مشاهده شرایط سرویس گارانتی دیجی کالا{" "}
            <u>
              <Link
                href="/faq/guarantee"
                target="_blank"
                className="text-sky-700"
              >
                کلیک کنید
              </Link>
            </u>
            "
          </p>

          {/* Text Sections */}
          <div className="py-5 text-body-1 space-y-5">
            {sections.map((text: string, idx: number) => (
              <p key={idx}>{text}</p>
            ))}
          </div>

          {/* FAQ and Categories */}
          <FaqBlock />
        </article>
      </section>

      <ContactSection />
    </div>
  );
}

/* ────────────── Subcomponents ────────────── */

function HeroSection() {
  return (
    <section className="relative h-72 bg-gradient-to-b from-neutral-200 to-white dark:from-neutral-700 dark:to-neutral-950">
      <div className="grayscale h-2/3 w-full bg-[url('/nav-links-svg.svg')] opacity-10 dark:opacity-60" />
      <div className="absolute top-10 left-0 right-0 mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-sky-950">
          <FileQuestion size={22} className="text-sky-500" />
        </div>
        <p className="my-5 font-irsansb text-xs text-sky-500">بازگرداندن کالا</p>
        <h1 className="max-sm:px-10 text-lg font-irsansb dark:text-white">
          در چه شرایطی میتوانم کالای خود را بازگردانم؟
        </h1>
      </div>
    </section>
  );
}

function FaqBlock() {
  return (
    <div className="py-14 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
          <FileQuestion size={22} className="text-sky-500" />
        </div>
        <h3 className="mt-5 mb-10 font-irsansb text-lg">پرسش‌های متداول</h3>
      </div>
      <ReturnAccordion />
      <FaqCategories />
    </div>
  );
}

function ContactSection() {
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
