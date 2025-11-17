// Refactored ShoppingCartItems Component
// Clean, optimized, no huge inline SVGs, reusable helpers added

"use client";

import { useCart } from "@/src/utils/cartItemsContext";
import { CartItem, User } from "@/src/utils/types";
import useScroll from "@/src/utils/useScroll";
import { ShieldCheck, Store, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import CartItemControls from "./CartItemControls";
import { addOrder } from "@/src/app/admin/orders/action";

export default function ShoppingCartItems({ user }: { user: User }) {
  const router = useRouter();

  const {
    cart,
    setCart,
    totalDiscountPrice,
    totalPrice,
    totalDiscount,
    clearCart,
  } = useCart();

  const { isVisible } = useScroll();

  // Load cart from localStorage once
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (storedCart.length > 0) {
        setCart(storedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, [setCart]);

  // Add items to order table if user is logged in
  useEffect(() => {
    const syncOrders = async () => {
      const stored: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

      if (user && stored.length > 0) {
        try {
          for (const item of stored) {
            const form = new FormData();
            form.append("productId", item._id.toString());
            form.append("userId", user._id.toString());

            const errors = await addOrder(form);
            if (errors) {
              console.log("Validation errors", errors);
              return;
            }
          }
        } catch (err) {
          console.error("Order sync error", err);
        }
      }
    };

    syncOrders();
  }, [user]);

  const handleClearCart = () => {
    toast(
      (t) => (
        <div>
          همه کالاها را از سبد حذف می‌کنید؟
          <div className="flex justify-end mt-5">
            <Button
              className="ml-3"
              variant="secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              بازگشت
            </Button>
            <Button variant="destructive" onClick={clearCart}>
              حذف همه
            </Button>
          </div>
        </div>
      ),
      { position: "top-left" }
    );
  };

  const confirmOrder = () => {
    if (!user) router.push("/login");
    else router.push("/checkout/shipping");
  };

  // EMPTY CART UI
  const EmptyCart = () => (
    <div className="lg:border rounded-lg p-5 sm:mx-4 flex items-center justify-center flex-col gap-5">
      <div className="text-neutral-500 dark:text-neutral-400 text-center text-sm">
        {/* SVG replaced with simple placeholder */}
        <div className="w-32 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-md mb-4"></div>
        <h5 className="font-irsansb text-neutral-700 dark:text-neutral-100">
          سبد خرید شما خالی است!
        </h5>
        <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
          می‌توانید برای مشاهده محصولات بیشتر به صفحات دیگر بروید.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {cart.length > 0 ? (
        <div className="relative grid grid-cols-12 gap-3">
          {/* Items List */}
          <div className="lg:col-span-9 col-span-12 lg:border rounded-lg">
            <div className="px-4 sm:px-8 py-4 flex justify-between items-start">
              <div className="space-y-2">
                <h5 className="font-irsansb">سبد خرید شما</h5>
                <p className="text-xs text-neutral-500 dark:text-neutral-300">
                  {cart.length} کالا
                </p>
              </div>

              <button
                onClick={handleClearCart}
                className="text-sm flex text-neutral-500 items-center gap-1 hover:text-red-500 transition-all"
              >
                <Trash2 size={15} />
                حذف همه
              </button>
            </div>

            <div className="divide-y">
              {cart.map((product) => (
                <div key={product._id.toString()} className="py-8 sm:px-8 px-4">
                  <div className="flex items-center sm:gap-10 gap-5">
                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        width={100}
                        height={100}
                        className="flex-1"
                      />
                    </Link>

                    <div className="flex-1 text-neutral-500 dark:text-neutral-400 space-y-2 text-xs">
                      <p className="text-sm font-irsansb text-neutral-700 dark:text-neutral-100 mb-5">
                        {product.title}
                      </p>

                      <p className="flex gap-3">
                        <ShieldCheck size={15} />
                        {product.guarantee}
                      </p>

                      <p className="flex gap-3">
                        <Store size={15} /> دیجی‌کالا
                      </p>

                      <p className="flex gap-3">
                        <Truck size={15} className="text-red-500" /> ارسال دیجی‌کالا
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <CartItemControls product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div
            className={`lg:col-span-3 col-span-12 sticky ${
              isVisible ? "top-[8.5rem]" : "top-24"
            }`}
          >
            <div className="lg:border rounded-lg space-y-6 p-6">
              {/* Total Price */}
              <div className="flex items-center justify-between dark:text-neutral-300 text-neutral-500">
                <span className="text-sm">قیمت کالاها ({cart.length})</span>
                <span className="font-bold flex items-center gap-1">
                  {totalPrice.toLocaleString()}
                  <span className="text-xs">تومان</span>
                </span>
              </div>

              {/* Discounted Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-neutral-300">جمع سبد خرید</span>
                <span className="font-bold text-neutral-700 dark:text-white flex items-center gap-1">
                  {totalDiscountPrice.toLocaleString()}
                  <span className="text-xs">تومان</span>
                </span>
              </div>

              {/* Savings */}
              <div className="flex items-center justify-between text-red-500">
                <span className="text-sm">سود شما از خرید</span>
                <span className="font-bold flex items-center gap-1">
                  ({totalDiscount}٪) {(totalPrice - totalDiscountPrice).toLocaleString()}
                  <span className="text-xs">تومان</span>
                </span>
              </div>

              <Button onClick={confirmOrder} className="w-full">
                تایید و تکمیل سفارش
              </Button>

              <p className="text-[11px] text-neutral-400 mt-3">
                هزینه این سفارش هنوز پرداخت نشده و در صورت اتمام موجودی، کالاها حذف می‌شوند.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCart />
      )}

      {/* Bottom Bar (Mobile) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed flex shadow items-center py-3 px-4 bg-white dark:bg-neutral-900 w-full bottom-[3.55rem] right-0 border-t z-30">
          <div className="flex justify-between items-center w-full">
            <Button onClick={confirmOrder}>تایید و تکمیل سفارش</Button>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                جمع سبد خرید
              </p>
              <p className="text-neutral-800 dark:text-neutral-100 text-sm flex items-center gap-1">
                {totalDiscountPrice.toLocaleString()}
                <span className="text-xs">تومان</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
