import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import persianLogo from "../../../public/logo/digi.svg";
import CartLengthPseudo from "../cart/CartLengthPseudo";
import { DarkMode } from "../ui/DarkMode";
import ProfileButton from "../ui/ProfileButton";
import Searchbar from "./Searchbar";
import TopbarContainer from "./TopbarContainer";
import { User } from "@/src/utils/types";

// 🧩 Mock user data (no DB)
const mockUser: User = {
  _id: "u1" as any,
  name: "کاربر مهمان",
  email: "guest@example.com",
  phone: "",
  password: "",
  role: "USER",
  avatar: "/images/avatar-placeholder.png",
};

export default function Topbar() {
  const user = mockUser;

  return (
    <TopbarContainer>
      {/* 💻 Desktop view */}
      <div className="max-lg:hidden">
        <div className="flex justify-between w-full items-center">
          {/* 🔍 Logo + Searchbar */}
          <div className="flex gap-2 w-[45rem]">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 115 30"
                className="mx-auto h-12 w-28 ml-5"
              >
                <path
                  d="M76.916 19.024h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195zm26.883 0h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195zM88.117 6.951v15.366c0 .484-.625 1.098-1.12 1.098l-2.24.023c-.496 0-1.12-.637-1.12-1.12v-.733l-1.017 1.196c-.31.413-1.074.634-1.597.634h-4.107c-3.604 0-6.721-3.063-6.721-6.586v-4.39c0-3.523 3.117-6.585 6.72-6.585h10.082c.495 0 1.12.613 1.12 1.097zm26.883 0v15.366c0 .484-.624 1.098-1.12 1.098l-2.24.023c-.496 0-1.12-.637-1.12-1.12v-.733l-1.017 1.196c-.31.413-1.074.634-1.597.634h-4.107c-3.604 0-6.721-3.063-6.721-6.586v-4.39c0-3.523 3.117-6.585 6.72-6.585h10.082c.495 0 1.12.613 1.12 1.097z"
                  fill="#EE384E"
                  fillRule="evenodd"
                ></path>
              </svg>
            </Link>
            <Searchbar />
          </div>

          {/* 👤 User / Cart / Theme */}
          <div className="flex items-center gap-2">
            <ProfileButton user={user} />
            <div className="w-[0.5px] h-6 bg-gray-300 mr-2"></div>

            <div className="relative mx-2">
              <Link href="/checkout/cart/">
                <ShoppingCart />
              </Link>
              <CartLengthPseudo />
              <span className="sr-only">Shopping Cart</span>
            </div>

            <div className="w-[0.5px] h-6 bg-gray-300"></div>
            <DarkMode />
          </div>
        </div>
      </div>

      {/* 📱 Mobile view */}
      <div className="lg:hidden mb-12">
        <div className="fixed top-0 right-0 left-0 mx-auto px-4 pt-4">
          <div className="relative w-full">
            <Searchbar placeholder="جستجو در..." />
            <div className="absolute right-[7.7rem] top-3">
              <Image alt="Logo" width={100} height={100} src={persianLogo} />
            </div>
          </div>
        </div>
      </div>
    </TopbarContainer>
  );
}
