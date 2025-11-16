"use client";

import axios from "axios";
import { Button } from "@/src/components/ui/button";

export default function CheckoutButton({
  totalPrice,
  disabled,
  isVisible,
  loading,
}: {
  totalPrice: number;
  disabled: boolean;
  isVisible: boolean;
  loading: boolean;
}) {
  const pay = async () => {
    try {
      const res = await axios.post("/api/checkout", { totalPrice });
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-neutral-800 shadow-lg transition-all ${
        isVisible ? "translate-y-0" : "translate-y-24"
      }`}
    >
      <Button
        className="w-full py-3 text-sm font-irsansb"
        disabled={disabled || loading}
        onClick={pay}
      >
        {loading ? "در حال انتقال..." : `پرداخت و ثبت سفارش (${totalPrice.toLocaleString()} تومان)`}
      </Button>
    </div>
  );
}
