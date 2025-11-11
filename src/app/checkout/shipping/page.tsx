import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ShippingForm from "@/src/components/cart/ShippingForm";
import { authUser } from "@/src/utils/auth";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { User } from "@/src/utils/types";
import persianLogo from "@/public/logo/digi.svg";

// ─────────────────────────── Metadata ───────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ارسال سفارش",
  };
}

// ─────────────────────────── Component ───────────────────────────
export default async function ShippingPage() {
  const user = await authUser();

  // Optional: protect against unauthenticated users
  if (!user) {
    return (
      <div className="mt-20 flex flex-col items-center text-center">
        <p className="text-neutral-600 dark:text-neutral-300">
          لطفاً ابتدا وارد حساب کاربری خود شوید.
        </p>
        <Link
          href="/login"
          className="mt-3 text-red-500 underline hover:text-red-600"
        >
          ورود به حساب کاربری
        </Link>
      </div>
    );
  }

  const serializedUser = serializeDoc(user as User);

  return (
    <>
      <div className="lg:mx-20 lg:my-7 lg:grid lg:grid-cols-12 lg:items-center lg:rounded-md lg:border p-4 flex flex-col-reverse">
        <Link
          href="/checkout/cart"
          className="lg:col-span-6 flex items-center gap-2 max-lg:pt-5 max-lg:text-sm"
        >
          <ArrowRight
            size={22}
            className="text-neutral-700 dark:text-neutral-100"
          />
          <span className="font-irsansb text-neutral-900 dark:text-white">
            آدرس
          </span>
        </Link>
        <div className="col-span-6 max-lg:mx-auto">
          <Image alt="Logo" width={100} height={100} src={persianLogo} />
        </div>
      </div>

      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 lg:hidden" />

      <ShippingForm user={serializedUser} />
    </>
  );
}
