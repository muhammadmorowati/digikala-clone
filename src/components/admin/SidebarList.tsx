"use client";

import { signOut } from "@/src/app/admin/users/action";
import {
  BringToFront,
  ChevronLeft,
  CircleFadingPlus,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Newspaper,
  PackageOpen,
  ShoppingBasket,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { ReactNode } from "react";

interface MenuItem {
  label: string;
  icon: ReactNode;
  href: string;
}

const sidebarMenu: MenuItem[] = [
  { label: "پیشخوان", icon: <LayoutDashboard />, href: "/admin" },
  { label: "محصولات", icon: <PackageOpen />, href: "/admin/products" },
  { label: "سفارشات", icon: <ShoppingBasket />, href: "/admin/orders" },
  { label: "دسته‌بندی ها", icon: <LayoutTemplate />, href: "/admin/categories" },
  {
    label: "زیرمجموعه دسته‌بندی ها",
    icon: <Layers3 />,
    href: "/admin/categories/submenu",
  },
  {
    label: "آیتم های زیرمجموعه ها",
    icon: <BringToFront />,
    href: "/admin/categories/submenu-item",
  },
  { label: "مقالات", icon: <Newspaper />, href: "/admin/articles" },
  { label: "داستان ها", icon: <CircleFadingPlus />, href: "/admin/stories" },
  { label: "کاربران", icon: <Users2 />, href: "/admin/users" },
];

export default function SidebarList({
  closeSheet,
}: {
  closeSheet?: () => void;
}) {
  const router = useRouter();

  const signoutHandler = () => {
    toast(
      (t) => (
        <div>
          از حساب کاربری خود خارج می شوید؟
          <div className="flex justify-end mt-3 gap-3">
            <Button
              variant="secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              انصراف
            </Button>

            <Button
              variant="destructive"
              onClick={async () => {
                await signOut();
                toast.dismiss(t.id);
                closeSheet?.(); // <-- FIXED
                toast.success("از حساب خود خارج شدید.");
              }}
            >
              خروج از حساب
            </Button>
          </div>
        </div>
      ),
      { position: "top-left" }
    );
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Logo */}
      <div className="py-5 flex items-center justify-center">
        <h1 onClick={() => closeSheet?.()}>
          <Logo />
        </h1>
      </div>

      {/* Menu List */}
      <ul>
        {sidebarMenu.map((item, index) => (
          <li
            key={index}
            onClick={() => closeSheet?.()}
            className="px-5 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
          >
            <Link
              href={item.href}
              className="flex items-center justify-between border-t py-[18px]"
            >
              <div className="flex items-center gap-4">
                <span className="text-neutral-500">{item.icon}</span>
                <p>{item.label}</p>
              </div>
              <ChevronLeft size={14} />
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <Button
        variant="secondary"
        onClick={signoutHandler}
        className="hover:bg-neutral-200 dark:hover:bg-neutral-700 w-full justify-start py-6 flex gap-4 cursor-pointer"
      >
        <span className="text-neutral-500">
          <LogOut />
        </span>
        <span>خروج از حساب کاربری</span>
      </Button>
    </div>
  );
}
