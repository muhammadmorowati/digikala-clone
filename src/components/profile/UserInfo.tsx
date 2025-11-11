import { User } from "@/src/utils/types";
import { ChevronLeft, Pencil } from "lucide-react";

export default function UserInfo() {
  // Mock user data (replace with local data if needed)
  const user: User = {
    _id: "1",
    name: "کاربر دیجی‌کالا",
    email: "user@digikala.com",
    phone: "09123456789",
    password: "",
    role: "USER",
    avatar: "/images/default-avatar.png",
  };

  return (
    <div className="lg:flex flex-col gap-5 px-5">
      <div className="max-lg:mb-5 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="font-irsansb text-sm">{user.name}</span>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {user.phone}
          </span>
        </div>
        <Pencil size={20} className="text-sky-500" />
      </div>

      <hr className="text-neutral-500 lg:hidden" />

      <div className="flex lg:flex-col sm:gap-7 max-lg:mt-5">
        {/* کیف پول */}
        <div className="max-lg:flex gap-2 items-center">
          <p className="text-xs max-lg:hidden">کیف پول</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 28 28"
            fill="none"
            className="lg:hidden"
          >
            <path
              d="M2.74512 6.6344L20.8099 3.44909C21.601 3.3096 22.3554 3.83784 22.4949 4.62896L24.4454 15.6906C24.5849 16.4818 24.0566 17.2362 23.2655 17.3757L5.20075 20.561L2.74512 6.6344Z"
              fill="#FFAEFF"
            />
          </svg>
          <div className="flex max-lg:gap-2 flex-col">
            <div className="flex gap-1 lg:justify-end">-</div>
            <span className="flex text-sky-500 text-xs font-irsansb">
              فعالسازی
              <ChevronLeft size={16} />
            </span>
          </div>
        </div>

        {/* دیجی‌کلاب */}
        <div className="max-lg:flex gap-2 items-center">
          <p className="text-xs max-lg:hidden">دیجی کلاب</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 18 18"
            fill="none"
            className="lg:hidden"
          >
            <circle cx="9" cy="9" r="8" fill="#FFDF4E" />
          </svg>
          <div className="flex max-lg:gap-2 flex-col">
            <span className="flex gap-1 lg:justify-end">
              -
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                امتیاز
              </span>
            </span>
            <span className="flex text-sky-500 text-xs font-irsansb">
              مأموریت‌های دیجی‌کلاب
              <ChevronLeft size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
