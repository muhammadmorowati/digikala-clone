import { partners } from "@/src/data/data";
import { Headset } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import App from "./App";
import Description from "./Description";
import FooterFaq from "./FooterFaq";
import FooterLinks from "./FooterLinks";
import MobileSizeApp from "./MobileSizeApp";
import ScrollUp from "./ScrollUp";

// 🧩 Mock user data (since DB is removed)
const mockUser = {
  _id: "1",
  name: "کاربر تستی",
  email: "test@example.com",
  phone: "09120000000",
  role: "USER",
};

export default function Footer() {
  const user = mockUser;

  return (
    <>
      <div className="border-t px-3 pt-5 max-lg:pb-14 border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <svg
            width="120"
            height="30"
            viewBox="0 0 136 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="max-lg:hidden"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M112.005 13C111.423 13 111.005 13.418 111.005 14V21C111.005 22.3628 110.368 23 109.005 23H100.007V15.5C100.007 11.2647 96.7428 8 92.5083 8H86.0096C85.4045 8 84.3749 8.01669 84.01 8.5L82.0104 11.5C81.6256 12.0092 81.8723 13 82.5103 13H92.5083C93.8711 13 95.0079 14.137 95.0079 15.5V23H74.0119C73.4294 23 73.0121 23.4176 73.0121 24V27C73.0121 27.5826 73.4294 28 74.0119 28H78.0111C78.0111 29.363 76.3745 31 75.0117 31H66.0134C64.6509 31 64.0138 30.363 64.0138 29V19C64.0138 18.4182 63.5959 18 63.014 18H60.0146C59.4327 18 59.0148 18.4182 59.0148 19V29C59.0148 33.5 61.5143 36 66.0134 36H75.0117C79.2462 36 83.0102 32.2353 83.0102 28H99.0071C99.588 28 100.007 27.5808 100.007 27V26L101.098 27.3892C101.463 27.8724 101.901 28 102.506 28H109.005C113.24 28 116.004 25.2353 116.004 21V14C116.004 13.418 115.586 13 115.004 13H112.005Z"
              fill="#EF394E"
            />
          </svg>
          <div className="max-lg:text-sky-500 max-lg:mx-auto lg:border rounded-md px-5 py-3 text-gray-400 dark:text-gray-200 text-xs">
            <ScrollUp
              className="flex items-center gap-3"
              title="بازگشت به بالا"
            />
          </div>
        </div>

        {/* Desktop contact info */}
        <div className="max-lg:hidden flex gap-5 text-xs text-gray-700 dark:text-gray-200 mt-5">
          <span>تلفن پشتیبانی ۶۱۹۳۰۰۰۰ - ۰۲۱</span>
          <span>|</span>
          <span>۰۲۱-۹۱۰۰۰۱۰۰</span>
          <span>|</span>
          <span>۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم</span>
        </div>

        {/* Mobile contact */}
        <div className="lg:hidden border-b pb-5 mt-5 flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <Headset size={22} />
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                ۷ روز هفته، ۲۴ ساعت
              </span>
              <span className="text-sm text-neutral-950 dark:text-neutral-100">
                تماس با پشتیبانی
              </span>
            </div>
          </div>
          <button className="border rounded-md text-sm py-2 px-3 border-gray-700">
            <a href="tel:02161930000">تماس</a>
          </button>
        </div>

        <MobileSizeApp />
        <div className="my-10">
          <FooterFaq vertical />
        </div>
        <FooterLinks user={user} />
        <App />

        <div className="max-lg:hidden my-10 w-full border-b bg-gray-400"></div>
        <div className="grid grid-cols-12 w-full gap-7">
          <div className="col-span-9 max-lg:col-span-12">
            <Description />
          </div>
          <div className="col-span-3 flex gap-2 max-lg:hidden">
            {["rezi.webp", "kasbokar.webp", "enamad.png"].map((src, idx) => (
              <Link
                key={idx}
                target="_blank"
                href="#"
                className="bg-white w-28 h-24 border rounded-lg flex items-center justify-center"
              >
                <Image
                  alt="badge"
                  width={70}
                  height={70}
                  src={`/nemad/${src}`}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="max-lg:hidden my-10 w-full border-b bg-gray-400"></div>
        <div className="text-xs max-lg:hidden text-gray-500 text-center w-full dark:text-gray-400">
          برای استفاده از مطالب دیجی‌کالا، داشتن «هدف غیرتجاری» و ذکر «منبع»
          کافیست. تمام حقوق اين وب‌سايت نیز برای شرکت نوآوران فن آوازه (فروشگاه
          آنلاین دیجی‌کالا) است.
        </div>
      </div>

      {/* Partners */}
      <div className="max-lg:hidden flex h-20 mt-10">
        {partners.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-neutral-900 dark:border-neutral-950 border border-gray-200 flex flex-1 items-center justify-center"
          >
            {item.title}
          </div>
        ))}
      </div>

      <div className="max-lg:hidden flex h-20">
        {partners.slice(8, 15).map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-neutral-900 dark:border-neutral-950 border border-gray-200 flex flex-1 items-center justify-center"
          >
            {item.title}
          </div>
        ))}
      </div>
    </>
  );
}
