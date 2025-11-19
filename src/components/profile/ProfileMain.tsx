"use client";

import ProfileTabs from "@/src/components/profile/ProfileTabs";
import { Product, User } from "@/src/utils/types";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PersonalInfo from "./PersonalInfo";
import WarnSection from "./WarnSection";

type ProfileSection =
  | "orders"
  | "lists"
  | "comments"
  | "addresses"
  | "gift-cards"
  | "notification"
  | "user-history"
  | "personal-info";

export default function ProfileMain({
  products,
  user,
  id,
}: {
  products: Product[];
  user: User;
  id: ProfileSection;
}) {
  const router = useRouter();

  // 📌 Central config for sections
  const tabConfig: Record<
    ProfileSection,
    | {
        tabsArray: string[];
        src: string;
        title: string;
        products?: Product[];
        user?: User;
        searchbar?: boolean;
      }
    | undefined
  > = {
    orders: {
      tabsArray: ["جاری", "تحویل شده", "مرجوع شده", "لغو شده"],
      src: "/profile/order-empty.svg",
      title: "تاریخچه سفارشات",
      searchbar: true,
    },
    lists: {
      tabsArray: ["لیست علاقه‌مندی", "لیست‌های دیگر", "اطلاع‌رسانی‌ها"],
      src: "/profile/favorites-list-empty.svg",
      title: "لیست‌ها",
      products,
    },
    comments: {
      tabsArray: ["در انتظار دیدگاه", "دیدگاه‌های من", "پرسش‌های من"],
      src: "/profile/order-empty.svg",
      title: "دیدگاه",
    },
    addresses: {
      tabsArray: ["آدرس‌ها"],
      src: "/profile/address.svg",
      title: "آدرس‌",
      user,
    },
    "gift-cards": {
      tabsArray: ["هدیه گرفتم", "هدیه دادم"],
      src: "/profile/empty-gift-card.webp",
      title: "کارت هدیه ",
    },
    notification: {
      tabsArray: ["پیغام‌ها"],
      src: "/profile/order-empty.svg",
      title: "پیغام‌",
    },
    "user-history": {
      tabsArray: ["بازدیدهای اخیر"],
      src: "/profile/order-empty.svg",
      title: "بازدیدهای اخیر",
      products,
    },
    "personal-info": undefined, // handled separately
  };

  // 👉 If not "personal-info", load profile tabs dynamically
  const config = tabConfig[id];

  return (
    <div>
      {config && (
        <ProfileTabs
          tabsArray={config.tabsArray}
          src={config.src}
          title={config.title}
          searchbar={config.searchbar}
          products={config.products}
          user={config.user}
        />
      )}

      {id === "personal-info" && (
        <div className="flex flex-col gap-5">
          <h5 className="gap-2 pt-4 px-4 text-neutral-800 dark:text-white font-irsansb flex items-center">
            <span
              className="lg:hidden cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <ArrowRight size={20} />
            </span>
            اطلاعات حساب کاربری
          </h5>

          <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 lg:hidden my-3" />

          <WarnSection />
          <PersonalInfo user={user} />
        </div>
      )}
    </div>
  );
}
