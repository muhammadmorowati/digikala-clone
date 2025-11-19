"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useCart } from "@/src/utils/cartItemsContext";
import { CartItem, Product } from "@/src/utils/types";
import {
  ChevronLeft,
  Info,
  PackageOpen,
  ShieldCheck,
  Store,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CartItemControls from "../cart/CartItemControls";
import { Button } from "../ui/button";
import Modal from "../ui/Modal";

export default function ProductSeller({ product }: { product: Product }) {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [existingProduct, setExistingProduct] = useState<CartItem | undefined>();

  const router = useRouter();
  const { cart, setCart } = useCart();

  const closeModal = () => setIsShowModal(false);

  // 🟢 Sync existing product in cart
  useEffect(() => {
    const found = cart.find((item) => item._id === product._id);
    setExistingProduct(found);
  }, [cart, product._id]);

  // 🟢 Add product to cart
  const addToCart = () => {
    const cartItem: CartItem = {
      _id: product._id,
      title: product.title,
      thumbnail: product.thumbnail,
      guarantee: product.guarantee,
      price: product.price,
      discount_price: product.discount_price,
      discount: product.discount,
      count: 1,
    };

    const updatedCart = [...cart, cartItem];

    setCart(updatedCart);

    // LocalStorage safety
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    // SweetAlert
    Swal.fire({
      html: `
        <div>
          <div style="display: flex; align-items: center; gap:10px; padding-bottom: 20px;">
            <svg xmlns="http://www.w3.org/2000/svg" ...></svg>
            <h2 style="font-size:15px; color:rgb(57, 170, 0)">این کالا به سبد خرید اضافه شد!</h2>
          </div>

          <div style="display: flex; border-top: 1px solid #e7e7e7;padding-top: 20px; align-items: center; gap:20px">
            <img 
              src="${product.thumbnail}" 
              alt="${product.title}" 
              width="100" 
              height="100" 
              style="border-radius: 8px;"
            />
            <p style="font-weight:bold;font-size: 14px;line-height: 30px; color: #272727;text-align: right;">
              ${product.title}
            </p>
          </div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "برو به سبد خرید",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/checkout/cart");
      }
    });
  };

  if (!product) return null;

  return (
    <>
      {/* Main Seller Box */}
      <div className="h-fit flex flex-col gap-5 border bg-neutral-50 dark:bg-neutral-800 col-span-3 max-lg:col-span-12 rounded-lg p-5">
        <h4>فروشنده</h4>

        {/* Seller Info */}
        <div>
          <p className="flex gap-5 items-center mb-2">
            <Store size={20} className="text-neutral-600 dark:text-neutral-400" />
            <span className="text-neutral-700 dark:text-neutral-300">دیجی‌کالا</span>
          </p>

          <p className="text-xs flex gap-5 items-center text-neutral-600 dark:text-neutral-400">
            <Store size={20} className="opacity-0" />
            <span>
              <span className="text-green-600 font-bold">
                {product.likes ?? 0}%
              </span>{" "}
              رضایت از کالا
              <span className="px-2 text-neutral-300">|</span>
              عملکرد{" "}
              <span className="text-green-600 font-irsansb">
                {product.likes >= 80 && "عالی"}
                {product.likes >= 60 && product.likes < 80 && "خوب"}
                {product.likes >= 40 && product.likes < 60 && "متوسط"}
                {product.likes < 40 && "ضعیف"}
              </span>
            </span>
          </p>
        </div>

        <hr className="dark:border-neutral-700" />

        {/* Desktop Pricing */}
        <div className="max-lg:hidden cursor-pointer flex justify-between items-center">
          {/* Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div><Info size={16} className="text-neutral-500" /></div>
              </TooltipTrigger>
              <TooltipContent className="px-0 py-0">
                <p className="w-80 text-xs leading-7 p-2 bg-slate-700 text-white">
                  این کالا توسط فروشنده آن قیمت‌گذاری شده‌ است.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Price */}
          <div className="flex flex-col gap-2">
            {product.discount ? (
              <div className="flex items-center gap-4">
                <div className="text-neutral-400 text-xs line-through">
                  {product.price.toLocaleString()}
                </div>
                <div className="rounded-xl w-10 p-0.5 flex itece justify-center bg-red-600 text-white text-xs">
                  {product.discount}%
                </div>
              </div>
            ) : null}

            <p className="flex gap-1">
              <span className="text-neutral-950 dark:text-white text-lg">
                {product.discount_price.toLocaleString()}
              </span>
              {/* Toman Icon */}
              <svg width="18" height="18" className="fill-neutral-600 dark:fill-neutral-300">
                <path d="..." />
              </svg>
            </p>
          </div>
        </div>

        {/* Desktop Cart Button */}
        <div className="max-lg:hidden">
          {existingProduct ? (
            <div className="flex items-center gap-5">
              <CartItemControls product={existingProduct} />
              <div className="text-sm space-y-2 text-neutral-700">
                <p>در سبد شما</p>
                <p className="text-xs">
                  مشاهده{" "}
                  <Link className="text-sky-500" href="/checkout/cart">
                    سبد خرید
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <Button onClick={addToCart} className="w-full">افزودن به سبد</Button>
          )}
        </div>

        {/* Guarantee */}
        <div className="flex items-center gap-3 text-[13px]">
          <ShieldCheck size={21} className="text-neutral-700 dark:text-neutral-300" />
          <span>{product.guarantee || "گارانتی اصالت کالا"}</span>
        </div>

        <hr className="dark:border-neutral-700" />

        {/* Shipping Modal Trigger */}
        <div
          onClick={() => setIsShowModal(true)}
          className="cursor-pointer text-neutral-600 flex flex-col gap-3"
        >
          <p className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 dark:text-neutral-400">
              <Truck size={16} className="text-red-500" />
              ارسال دیجی‌کالا
            </span>
            <ChevronLeft size={17} className="dark:text-neutral-400" />
          </p>

          <p className="flex items-center gap-2 text-xs dark:text-neutral-400">
            <PackageOpen size={16} className="text-blue-700" />
            ارسال امروز (فعلا در تهران و کرج)
          </p>
        </div>

        <hr className="dark:border-neutral-700" />

        {/* Digiclub */}
        <div className="flex items-center gap-3 text-[13px]">
          {/* Icon */}
          <svg width="25" height="25">...</svg>
          <span>۱۵۰ امتیاز دیجی‌کلاب</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div><Info size={16} className="cursor-pointer text-neutral-500" /></div>
              </TooltipTrigger>
              <TooltipContent className="px-0 py-0">
                <p className="w-80 text-xs leading-7 p-2 bg-slate-700 text-white">
                  بعد از پایان مهلت مرجوعی دریافت امتیاز فعال می‌شود.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="lg:hidden fixed flex shadow items-center py-3 px-4 bg-white dark:bg-neutral-900 w-full bottom-0 right-0 border-t z-30">
        <div className="flex-1">
          {existingProduct ? (
            <CartItemControls product={existingProduct} />
          ) : (
            <Button onClick={addToCart} className="w-full">افزودن به سبد</Button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-end gap-2">
          {product.discount ? (
            <div className="flex items-center gap-5">
              <p className="text-xs text-neutral-400 line-through">
                {product.price.toLocaleString()}
              </p>
              <div className="bg-red-600 min-w-8 flex items-center justify-center text-[13px] text-white rounded-xl">
                {product.discount}%
              </div>
            </div>
          ) : null}

          <p className="flex gap-1">
            <span className="text-black text-[15px] dark:text-white">
              {product.discount_price.toLocaleString()}
            </span>
            <svg width="15" height="15" className="fill-neutral-600 dark:fill-neutral-300">
              <path d="..." />
            </svg>
          </p>
        </div>
      </div>

      {/* Shipping Modal */}
      <Modal closeModalHandler={closeModal} isOpen={isShowModal}>
        <div className="pt-5 pb-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="font-irsansb">جزئیات ارسال</span>
            <X size={18} onClick={closeModal} className="cursor-pointer" />
          </div>

          <hr className="dark:border-neutral-700" />

          <div>
            <h3 className="font-irsansb mb-2">ارسال دیجی‌کالا</h3>
            <p className="text-[13px] leading-7 text-neutral-600 dark:text-neutral-500">
              این کالا در انبار دیجی‌کالا موجود است و توسط پیک دیجی‌کالا در زمان انتخابی ارسال می‌شود.
            </p>
          </div>

          <div>
            <h3 className="font-irsansb mb-2">ارسال امروز</h3>
            <p className="text-[13px] leading-7 text-neutral-600 dark:text-neutral-500">
              اگر قبل از ۶ عصر سفارش دهید، همان روز ارسال می‌شود.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
