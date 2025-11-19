"use client";

import {
  Bell,
  Bug,
  ChevronLeft,
  FileQuestion,
  Headset,
  Lock,
  LogOut,
  Paperclip,
  Phone,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { signout } from "../ui/signout";

type SettingItem = {
  title: string;
  icon: ReactNode;
  href?: string;
  action?: () => void; // 👈 NOW a real function type
};

const settingList: SettingItem[] = [
  {
    title: "پرسش‌های متداول",
    icon: <FileQuestion className="text-neutral-500 dark:text-neutral-400" size={22} />,
    href: "/faq",
  },
  {
    title: "حریم خصوصی",
    icon: <Lock className="text-neutral-500 dark:text-neutral-400" size={22} />,
    href: "/privacy",
  },
  {
    title: "شرایط استفاده",
    icon: <Paperclip className="text-neutral-500 dark:text-neutral-400" size={22} />,
    href: "/terms",
  },
  {
    title: "تماس با ما",
    icon: <Phone className="text-neutral-500 dark:text-neutral-400" size={22} />,
    href: "/faq/contact-us",
  },
  {
    title: "گزارش خطا",
    icon: <Bug className="text-neutral-500 dark:text-neutral-400" size={22} />,
    href: "/bug-report",
  },
  {
    title: "خروج از حساب کاربری",
    icon: <LogOut className="text-red-500" size={22} />,
    action: signout, // 👈 REAL FUNCTION, not a component 🚀
  },
];

export default function ProfileHeader() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeModalHandler = () => setIsOpen(false);

  return (
    <>
      <div className="flex justify-between sticky top-0 max-lg:mx-4 py-5 z-10 bg-white dark:bg-neutral-950">
        <Settings onClick={() => setIsOpen(true)} className="cursor-pointer" />
        <div className="flex gap-4">
          <Headset />
          <div className="relative">
            <Bell />
            <span className="w-5 h-3 text-xs flex items-center justify-center bg-red-500 absolute bottom-0 text-white -right-2 rounded-sm">
              5
            </span>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} closeModalHandler={closeModalHandler}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="dark:text-neutral-100 text-neutral-800">
              <p className="mb-5">تنظیمات</p>
            </div>

            <div className="flex flex-col divide-y-2 divide-neutral-100 dark:divide-neutral-800">
              {settingList.map((item, index) => (
                <div key={index}>
                  {/* ✔ If href exists → Link */}
                  {item.href ? (
                    <Link
                      shallow
                      href={item.href}
                      onClick={closeModalHandler}
                      className="py-4 flex justify-between cursor-pointer whitespace-nowrap text-sm"
                    >
                      <div className="flex gap-5">
                        {item.icon}
                        <span className="text-neutral-950 dark:text-neutral-100">
                          {item.title}
                        </span>
                      </div>
                      <ChevronLeft size={20} className="text-neutral-500" />
                    </Link>
                  ) : (
                    // ✔ If action exists → button
                    <button
                      onClick={() => {
                        item.action?.();
                        closeModalHandler();
                      }}
                      className="py-4 flex justify-between w-full text-sm"
                    >
                      <div className="flex gap-5">
                        {item.icon}
                        <span className="font-irsansb text-red-500 dark:text-red-500">
                          {item.title}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DigiKala Logo */}
          <div className="w-full mb-5 flex justify-center items-center">
            {/* your SVG unchanged */}
          </div>
        </div>
      </Modal>
    </>
  );
}

function Modal({
  children,
  isOpen,
  closeModalHandler,
}: {
  children: ReactNode;
  isOpen: boolean;
  closeModalHandler: () => void;
}) {
  return (
    <div
      className={`fixed right-0 top-0 z-50 lg:hidden flex h-screen w-full cursor-default flex-col items-center bg-black/40 dark:bg-black/80 transition-all duration-500 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={closeModalHandler}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 w-full h-screen bg-white dark:bg-neutral-900 px-5 pb-5 pt-0 shadow transition-all duration-500 dark:text-white ${
          isOpen ? "translate-y-0" : "translate-y-96"
        }`}
      >
        <button className="relative w-full">
          <X size={20} onClick={closeModalHandler} className="absolute left-0 top-0" />
        </button>
        {children}
      </div>
    </div>
  );
}
